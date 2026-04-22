import prisma from "../config/db.js";
import { dispatchNotificationEventService } from "./notification.service.js";
import { getPricingCatalogService, updatePricingCatalogService } from "./plan.service.js";

export const getAdminDashboardSummaryService = async () => {
  const [
    usersCount,
    problemsCount,
    submissionsCount,
    contestsCount,
    premiumUsersCount,
    blockedUsersCount,
    notificationsCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.problem.count(),
    prisma.submission.count(),
    prisma.contest.count(),
    prisma.user.count({
      where: {
        plan: {
          in: ["STANDARD", "PRO"],
        },
      },
    }),
    prisma.user.count({
      where: {
        isBlocked: true,
      },
    }),
    prisma.notification.count(),
  ]);

  return {
    usersCount,
    problemsCount,
    submissionsCount,
    contestsCount,
    premiumUsersCount,
    blockedUsersCount,
    notificationsCount,
  };
};

export const listUsersForAdminService = async () => {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      avatarUrl: true,
      solvedCount: true,
      streak: true,
      isBlocked: true,
      blockedReason: true,
      provider: true,
      subscriptionStatus: true,
      createdAt: true,
    },
  });
};

export const updateUserRoleService = async ({ actorUserId, userId, role }) => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
    },
  });

  if (!existing) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      isBlocked: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "USER_ROLE_UPDATED",
      actorUserId,
      targetUserId: userId,
      metadata: {
        previousRole: existing.role,
        nextRole: role,
      },
    },
  });

  return updated;
};

export const blockUserService = async ({ actorUserId, userId, reason }) => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isBlocked: true,
    },
  });

  if (!existing) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const finalReason = reason || "Blocked by admin";

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      isBlocked: true,
      blockedAt: new Date(),
      blockedReason: finalReason,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      isBlocked: true,
      blockedReason: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "USER_BLOCKED",
      actorUserId,
      targetUserId: userId,
      metadata: {
        reason: finalReason,
      },
    },
  });

  await dispatchNotificationEventService({
    event: "USER_BLOCKED",
    actorUserId,
    payload: {
      targetUserId: userId,
      reason: finalReason,
    },
  });

  return updated;
};

export const unblockUserService = async ({ actorUserId, userId }) => {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      isBlocked: true,
    },
  });

  if (!existing) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      isBlocked: false,
      blockedAt: null,
      blockedReason: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      isBlocked: true,
      blockedReason: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "USER_UNBLOCKED",
      actorUserId,
      targetUserId: userId,
    },
  });

  await dispatchNotificationEventService({
    event: "USER_UNBLOCKED",
    actorUserId,
    payload: {
      targetUserId: userId,
    },
  });

  return updated;
};

export const listAuditLogsService = async () => {
  return prisma.auditLog.findMany({
    include: {
      actorUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      targetUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
};

export const getPricingCatalogForAdminService = async () => {
  return getPricingCatalogService();
};

export const updatePricingCatalogForAdminService = async ({
  actorUserId,
  plans,
}) => {
  return updatePricingCatalogService({
    actorUserId,
    plans,
  });
};