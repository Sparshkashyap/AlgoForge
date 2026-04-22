import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import {
  getNotificationSummaryService,
  listMyNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "./notification.service.js";
import { getMyBadgesService } from "./badge.service.js";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  plan: true,
  provider: true,
  avatarUrl: true,
  solvedCount: true,
  streak: true,
  lastSolvedAt: true,
  createdAt: true,
  updatedAt: true,
  lastSeenAt: true,
  isBlocked: true,
  blockedReason: true,
  currentPeriodEnd: true,
  subscriptionStatus: true,
};

const uploadBufferToCloudinary = (buffer, folder = "algoforge/avatars") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

const sanitizeProfilePayload = (payload = {}) => {
  const next = {};

  if (typeof payload.name === "string") {
    next.name = payload.name.trim();
  }

  if (typeof payload.email === "string") {
    next.email = payload.email.trim().toLowerCase();
  }

  if (typeof payload.avatarUrl === "string") {
    next.avatarUrl = payload.avatarUrl.trim();
  }

  return next;
};

const assertValidAvatarUrl = (avatarUrl) => {
  if (!avatarUrl || !/^https?:\/\/.+/i.test(String(avatarUrl).trim())) {
    const error = new Error("avatarUrl must be a valid http/https URL");
    error.statusCode = 400;
    throw error;
  }
};

export const getMyProfileService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateMyProfileService = async ({
  userId,
  name,
  email,
  avatarUrl,
}) => {
  const data = sanitizeProfilePayload({ name, email, avatarUrl });

  if (Object.prototype.hasOwnProperty.call(data, "name") && !data.name) {
    const error = new Error("Name cannot be empty");
    error.statusCode = 400;
    throw error;
  }

  if (
    Object.prototype.hasOwnProperty.call(data, "email") &&
    (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
  ) {
    const error = new Error("A valid email is required");
    error.statusCode = 400;
    throw error;
  }

  if (
    Object.prototype.hasOwnProperty.call(data, "avatarUrl") &&
    data.avatarUrl
  ) {
    assertValidAvatarUrl(data.avatarUrl);
  }

  return prisma.user.update({
    where: { id: userId },
    data,
    select: profileSelect,
  });
};

export const uploadAvatarService = async ({ userId, file }) => {
  if (!file?.buffer) {
    const error = new Error("Image file is required");
    error.statusCode = 400;
    throw error;
  }

  const uploaded = await uploadBufferToCloudinary(file.buffer);

  return prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: uploaded.secure_url,
    },
    select: profileSelect,
  });
};

export const removeMyAvatarService = async (userId) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: null,
    },
    select: profileSelect,
  });
};

export const updateUserAvatarByAdminService = async (
  targetUserId,
  avatarUrl
) => {
  assertValidAvatarUrl(avatarUrl);

  return prisma.user.update({
    where: { id: targetUserId },
    data: {
      avatarUrl: avatarUrl.trim(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      role: true,
      plan: true,
      provider: true,
      isBlocked: true,
      blockedReason: true,
      solvedCount: true,
      streak: true,
    },
  });
};

export const getMySolveStatsService = async (userId) => {
  const accepted = await prisma.submission.findMany({
    where: {
      userId,
      OR: [
        { verdict: "Accepted" },
        { verdict: "ACCEPTED" },
        { status: "ACCEPTED" },
      ],
    },
    select: {
      problemId: true,
      problem: {
        select: {
          difficulty: true,
        },
      },
    },
  });

  const uniqueByProblem = new Map();

  for (const entry of accepted) {
    if (!entry.problemId || uniqueByProblem.has(entry.problemId)) continue;

    uniqueByProblem.set(
      entry.problemId,
      String(entry.problem?.difficulty || "EASY").toUpperCase()
    );
  }

  let easy = 0;
  let medium = 0;
  let hard = 0;

  for (const difficulty of uniqueByProblem.values()) {
    if (difficulty === "EASY") easy += 1;
    else if (difficulty === "MEDIUM") medium += 1;
    else if (difficulty === "HARD") hard += 1;
  }

  return {
    totalSolved: uniqueByProblem.size,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard,
  };
};

export const getMyNotificationsService = async (userId) => {
  return listMyNotificationsService(userId);
};

export const getMyNotificationSummaryService = async (userId) => {
  return getNotificationSummaryService(userId);
};

export const readMyNotificationService = async ({
  userId,
  notificationId,
}) => {
  return markNotificationReadService({
    userId,
    notificationId,
  });
};

export const readAllMyNotificationsService = async (userId) => {
  return markAllNotificationsReadService(userId);
};

export const getMyBadgesListService = async (userId) => {
  return getMyBadgesService(userId);
};