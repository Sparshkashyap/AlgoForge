import prisma from "../config/db.js";
import { createAuditLogService } from "./audit.service.js";

const selectAdminUserList = {
  id: true,
  name: true,
  email: true,
  role: true,
  plan: true,
  avatarUrl: true,
  solvedCount: true,
  streak: true,
  isBlocked: true,
  blockedAt: true,
  blockedReason: true,
  createdAt: true,
  lastSeenAt: true,
  _count: {
    select: {
      submissions: true,
      problems: true,
    },
  },
};

const assertActorIsAdmin = async (actorUserId) => {
  const actor = await prisma.user.findUnique({
    where: { id: actorUserId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!actor || actor.role !== "ADMIN") {
    const error = new Error("Admin access required");
    error.statusCode = 403;
    throw error;
  }

  return actor;
};

const getTargetUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      isBlocked: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

const assertModerationAllowed = ({ actorUserId, targetUser, action }) => {
  if (actorUserId === targetUser.id) {
    const error = new Error(`You cannot ${action} yourself`);
    error.statusCode = 400;
    throw error;
  }

  if (targetUser.role === "ADMIN") {
    const error = new Error(`You cannot ${action} another admin`);
    error.statusCode = 403;
    throw error;
  }
};

export const listUsersForAdminService = async () => {
  return prisma.user.findMany({
    select: selectAdminUserList,
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateUserRoleService = async ({
  actorUserId,
  userId,
  role,
  ipAddress = null,
  userAgent = null,
}) => {
  await assertActorIsAdmin(actorUserId);

  const validRoles = ["USER", "CREATOR", "ADMIN"];

  if (!validRoles.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  const targetUser = await getTargetUser(userId);

  if (targetUser.role === role) {
    const error = new Error("User already has this role");
    error.statusCode = 400;
    throw error;
  }

  assertModerationAllowed({
    actorUserId,
    targetUser,
    action: "change role of",
  });

  const previousRole = targetUser.role;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      isBlocked: true,
      blockedAt: true,
      blockedReason: true,
    },
  });

  await createAuditLogService({
    action: "USER_ROLE_UPDATED",
    actorUserId,
    targetUserId: userId,
    ipAddress,
    userAgent,
    metadata: {
      previousRole,
      nextRole: role,
    },
  });

  return user;
};

export const blockUserService = async ({
  actorUserId,
  userId,
  reason,
  ipAddress = null,
  userAgent = null,
}) => {
  await assertActorIsAdmin(actorUserId);

  const targetUser = await getTargetUser(userId);

  assertModerationAllowed({
    actorUserId,
    targetUser,
    action: "block",
  });

  if (targetUser.isBlocked) {
    const error = new Error("User is already blocked");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      isBlocked: true,
      blockedAt: new Date(),
      blockedReason: reason?.trim() || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      isBlocked: true,
      blockedAt: true,
      blockedReason: true,
    },
  });

  await createAuditLogService({
    action: "USER_BLOCKED",
    actorUserId,
    targetUserId: userId,
    ipAddress,
    userAgent,
    metadata: {
      reason: reason?.trim() || null,
    },
  });

  return user;
};

export const unblockUserService = async ({
  actorUserId,
  userId,
  ipAddress = null,
  userAgent = null,
}) => {
  await assertActorIsAdmin(actorUserId);

  const targetUser = await getTargetUser(userId);

  assertModerationAllowed({
    actorUserId,
    targetUser,
    action: "unblock",
  });

  if (!targetUser.isBlocked) {
    const error = new Error("User is not blocked");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.update({
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
      blockedAt: true,
      blockedReason: true,
    },
  });

  await createAuditLogService({
    action: "USER_UNBLOCKED",
    actorUserId,
    targetUserId: userId,
    ipAddress,
    userAgent,
    metadata: null,
  });

  return user;
};

export const deleteUserService = async ({
  actorUserId,
  userId,
  ipAddress = null,
  userAgent = null,
}) => {
  await assertActorIsAdmin(actorUserId);

  const targetUser = await getTargetUser(userId);

  assertModerationAllowed({
    actorUserId,
    targetUser,
    action: "delete",
  });

  const snapshot = {
    id: targetUser.id,
    name: targetUser.name,
    email: targetUser.email,
    role: targetUser.role,
    isBlocked: targetUser.isBlocked,
  };

  await createAuditLogService({
    action: "USER_DELETED",
    actorUserId,
    targetUserId: userId,
    ipAddress,
    userAgent,
    metadata: snapshot,
  });

  await prisma.user.delete({
    where: { id: userId },
  });

  return {
    success: true,
    message: "User deleted successfully",
  };
};

export const getAdminStatsService = async () => {
  const [
    totalUsers,
    totalCreators,
    totalAdmins,
    totalProblems,
    totalSubmissions,
    blockedUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.problem.count(),
    prisma.submission.count(),
    prisma.user.count({ where: { isBlocked: true } }),
  ]);

  return {
    totalUsers,
    totalCreators,
    totalAdmins,
    totalProblems,
    totalSubmissions,
    blockedUsers,
  };
};