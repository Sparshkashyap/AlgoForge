import prisma from "../config/db.js";

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
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      solvedCount: true,
      streak: true,
      isBlocked: true,
      blockedReason: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateUserRoleService = async ({
  actorUserId,
  targetUserId,
  role,
}) => {
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      isBlocked: true,
      createdAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "USER_ROLE_UPDATED",
      actorUserId,
      targetUserId,
      metadata: {
        role,
      },
    },
  });

  return updatedUser;
};

export const blockUserService = async ({
  actorUserId,
  targetUserId,
  reason,
}) => {
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      isBlocked: true,
      blockedAt: new Date(),
      blockedReason: reason || "Blocked by admin",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      isBlocked: true,
      blockedReason: true,
      createdAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "USER_BLOCKED",
      actorUserId,
      targetUserId,
      metadata: {
        reason: reason || "Blocked by admin",
      },
    },
  });

  return updatedUser;
};

export const unblockUserService = async ({ actorUserId, targetUserId }) => {
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
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
      createdAt: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      action: "USER_UNBLOCKED",
      actorUserId,
      targetUserId,
    },
  });

  return updatedUser;
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