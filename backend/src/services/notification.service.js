import prisma from "../config/db.js";
import { emitToUsers } from "../config/socket.js";
import {
  enqueueContestReminderJob,
  enqueuePublishedProblemFanoutJob,
  enqueueDailyQuestionAssignmentJob,
} from "../queues/notification.queue.js";
import {
  buildNotificationPayloadsForEventService,
  NotificationAudience,
} from "./notification.rules.service.js";

const DEDUPE_WINDOW_MINUTES = 30;

const getTargetUsersByAudienceService = async ({
  audienceType,
  targetUserId = null,
}) => {
  if (audienceType === NotificationAudience.USER_ID) {
    if (!targetUserId) return [];

    return prisma.user.findMany({
      where: {
        id: targetUserId,
        isBlocked: false,
      },
      select: { id: true },
    });
  }

  if (audienceType === NotificationAudience.USER) {
    return prisma.user.findMany({
      where: {
        role: "USER",
        isBlocked: false,
      },
      select: { id: true },
    });
  }

  if (audienceType === NotificationAudience.CREATOR) {
    return prisma.user.findMany({
      where: {
        role: "CREATOR",
        isBlocked: false,
      },
      select: { id: true },
    });
  }

  if (audienceType === NotificationAudience.ADMIN) {
    return prisma.user.findMany({
      where: {
        role: "ADMIN",
        isBlocked: false,
      },
      select: { id: true },
    });
  }

  return [];
};

const isDuplicateNotificationService = async ({
  userId,
  type,
  title,
  data,
}) => {
  const since = new Date(Date.now() - DEDUPE_WINDOW_MINUTES * 60 * 1000);

  const recent = await prisma.notification.findFirst({
    where: {
      userId,
      type,
      title,
      createdAt: {
        gte: since,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!recent) return false;

  const oldData = JSON.stringify(recent.data || null);
  const newData = JSON.stringify(data || null);

  return oldData === newData;
};

export const createNotificationService = async ({
  userId,
  type,
  title,
  message,
  data = null,
  skipDedupe = false,
}) => {
  if (!skipDedupe) {
    const isDuplicate = await isDuplicateNotificationService({
      userId,
      type,
      title,
      data,
    });

    if (isDuplicate) {
      return null;
    }
  }

  const created = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data,
    },
  });

  emitToUsers([userId], "notification:new", created);

  return created;
};

export const createNotificationForUserService = createNotificationService;

export const createBulkNotificationsForUsersService = async ({
  userIds,
  type,
  title,
  message,
  data = null,
  skipDedupe = false,
}) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return { count: 0 };
  }

  const uniqueUserIds = [...new Set(userIds.filter(Boolean))];
  if (uniqueUserIds.length === 0) {
    return { count: 0 };
  }

  const createdNotifications = [];
  const emittedUsers = [];

  for (const userId of uniqueUserIds) {
    const created = await createNotificationService({
      userId,
      type,
      title,
      message,
      data,
      skipDedupe,
    });

    if (created) {
      createdNotifications.push(created);
      emittedUsers.push(userId);
    }
  }

  if (emittedUsers.length > 0) {
    emitToUsers(emittedUsers, "notification:new", {
      type,
      title,
      message,
      data,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }

  return {
    count: createdNotifications.length,
    notifications: createdNotifications,
  };
};

export const dispatchNotificationEventService = async ({
  event,
  actorUserId = null,
  payload = {},
}) => {
  const rules = buildNotificationPayloadsForEventService({
    event,
    actorUserId,
    payload,
  });

  const createdNotifications = [];

  for (const rule of rules) {
    const targetUsers = await getTargetUsersByAudienceService({
      audienceType: rule.audienceType,
      targetUserId: rule.targetUserId || null,
    });

    const emittedUsers = [];

    for (const target of targetUsers) {
      const created = await createNotificationService({
        userId: target.id,
        type: rule.type,
        title: rule.title,
        message: rule.message,
        data: rule.data || null,
      });

      if (created) {
        createdNotifications.push(created);
        emittedUsers.push(target.id);
      }
    }

    if (emittedUsers.length > 0) {
      emitToUsers(emittedUsers, "notification:new", {
        type: rule.type,
        title: rule.title,
        message: rule.message,
        data: rule.data || null,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }
  }

  return createdNotifications;
};

export const notifyPublishedProblemService = async ({
  problemId,
  title,
  slug,
  difficulty,
}) => {
  return enqueuePublishedProblemFanoutJob({
    problemId,
    title,
    slug,
    difficulty,
  });
};

export const scheduleContestRemindersService = async ({
  contestId,
  startAt,
}) => {
  const offsets = process.env.CONTEST_REMINDER_MINUTES
    ? String(process.env.CONTEST_REMINDER_MINUTES)
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isFinite(value) && value > 0)
    : [1440, 60];

  const jobs = [];

  for (const offsetMinutes of offsets) {
    const sendAt = new Date(
      new Date(startAt).getTime() - offsetMinutes * 60 * 1000
    );

    if (sendAt.getTime() > Date.now()) {
      jobs.push(
        enqueueContestReminderJob({
          contestId,
          reminderMinutes: offsetMinutes,
          sendAt,
        })
      );
    }
  }

  return Promise.all(jobs);
};

export const scheduleDailyQuestionAssignmentService = async () => {
  return enqueueDailyQuestionAssignmentJob();
};

export const listMyNotificationsService = async (userId) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
};

export const getNotificationSummaryService = async (userId) => {
  const [unreadCount, totalCount] = await Promise.all([
    prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    }),
    prisma.notification.count({
      where: {
        userId,
      },
    }),
  ]);

  return {
    unreadCount,
    totalCount,
  };
};

export const getMyNotificationSummaryService = getNotificationSummaryService;

export const markNotificationReadService = async ({
  userId,
  notificationId,
}) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  if (notification.isRead) {
    return notification;
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
};

export const markMyNotificationReadService = markNotificationReadService;

export const markAllNotificationsReadService = async (userId) => {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });

  return {
    success: true,
    message: "All notifications marked as read",
  };
};

export const markAllMyNotificationsReadService = markAllNotificationsReadService;