import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";
import {
  getNotificationSummaryService,
  listMyNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "./notification.service.js";
import { getMyBadgesService } from "./badge.service.js";

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

export const getMyProfileService = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      avatarUrl: true,
      solvedCount: true,
      streak: true,
      lastSolvedAt: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });
};

export const updateMyProfileService = async ({
  userId,
  name,
  email,
}) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      avatarUrl: true,
      solvedCount: true,
      streak: true,
      lastSolvedAt: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });
};

export const uploadAvatarService = async ({ userId, file }) => {
  if (!file) {
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
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      avatarUrl: true,
      solvedCount: true,
      streak: true,
      lastSolvedAt: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });
};

export const getMySolveStatsService = async (userId) => {
  const accepted = await prisma.submission.findMany({
    where: {
      userId,
      verdict: "Accepted",
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
    if (!uniqueByProblem.has(entry.problemId)) {
      uniqueByProblem.set(entry.problemId, entry.problem?.difficulty || "Unknown");
    }
  }

  let easy = 0;
  let medium = 0;
  let hard = 0;

  for (const difficulty of uniqueByProblem.values()) {
    if (difficulty === "Easy") easy += 1;
    else if (difficulty === "Medium") medium += 1;
    else if (difficulty === "Hard") hard += 1;
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