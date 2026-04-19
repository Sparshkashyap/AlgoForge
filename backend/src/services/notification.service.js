import prisma from "../config/db.js";
import {
  enqueueContestReminderJob,
  enqueuePublishedProblemFanoutJob,
  enqueueDailyQuestionAssignmentJob,
} from "../queues/notification.queue.js";

export const createNotificationService = async ({
  userId,
  type,
  title,
  message,
  data = null,
}) => {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data,
    },
  });
};

export const createBulkNotificationsForUsersService = async ({
  userIds,
  type,
  title,
  message,
  data = null,
}) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return { count: 0 };
  }

  const rows = userIds.map((userId) => ({
    userId,
    type,
    title,
    message,
    data,
  }));

  return prisma.notification.createMany({
    data: rows,
  });
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
    const sendAt = new Date(new Date(startAt).getTime() - offsetMinutes * 60 * 1000);

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
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
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