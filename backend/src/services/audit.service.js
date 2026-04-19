import prisma from "../config/db.js";

export const createAuditLogService = async ({
  action,
  actorUserId = null,
  targetUserId = null,
  ipAddress = null,
  userAgent = null,
  metadata = null,
}) => {
  return prisma.auditLog.create({
    data: {
      action,
      actorUserId,
      targetUserId,
      ipAddress,
      userAgent,
      metadata,
    },
  });
};

export const createLoginEventService = async ({
  userId = null,
  email,
  success,
  reason = null,
  ipAddress = null,
  userAgent = null,
  isSuspicious = false,
}) => {
  return prisma.loginEvent.create({
    data: {
      userId,
      email: email.trim().toLowerCase(),
      success,
      reason,
      ipAddress,
      userAgent,
      isSuspicious,
    },
  });
};

export const getRecentFailedLoginCountService = async ({
  email,
  ipAddress = null,
  withinMinutes = 30,
}) => {
  const since = new Date(Date.now() - withinMinutes * 60 * 1000);

  return prisma.loginEvent.count({
    where: {
      email: email.trim().toLowerCase(),
      success: false,
      createdAt: {
        gte: since,
      },
      ...(ipAddress ? { ipAddress } : {}),
    },
  });
};

export const listAuditLogsService = async () => {
  return prisma.auditLog.findMany({
    include: {
      actorUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      targetUser: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
};

export const listSuspiciousLoginEventsService = async () => {
  return prisma.loginEvent.findMany({
    where: {
      isSuspicious: true,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isBlocked: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });
};