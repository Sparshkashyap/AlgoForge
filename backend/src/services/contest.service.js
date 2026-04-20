import prisma from "../config/db.js";
import { notificationQueue } from "../queues/notification.queue.js";

const ensureProblemsExist = async (problemIds = []) => {
  if (!problemIds.length) return [];

  const problems = await prisma.problem.findMany({
    where: {
      id: { in: problemIds },
      isPublished: true,
    },
    select: { id: true },
  });

  if (problems.length !== problemIds.length) {
    const error = new Error("One or more contest problems are invalid");
    error.statusCode = 400;
    throw error;
  }

  return problems;
};

const scheduleContestReminders = async ({ contestId, startAt }) => {
  const startTime = new Date(startAt).getTime();

  const reminderMinutesList = String(
    process.env.CONTEST_REMINDER_MINUTES || "1440,60"
  )
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isFinite(v) && v > 0);

  for (const reminderMinutes of reminderMinutesList) {
    const delay = startTime - Date.now() - reminderMinutes * 60 * 1000;

    if (delay <= 0) continue;

    await notificationQueue.add(
      "contest-reminder",
      {
        contestId,
        reminderMinutes,
      },
      {
        jobId: `contest-reminder:${contestId}:${reminderMinutes}`,
        delay,
      }
    );
  }
};

export const createContestService = async ({
  title,
  description,
  startAt,
  endAt,
  isPublished = false,
  problemIds = [],
  createdById,
}) => {
  const startDate = new Date(startAt);
  const endDate = new Date(endAt);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    const error = new Error("Invalid contest dates");
    error.statusCode = 400;
    throw error;
  }

  if (endDate <= startDate) {
    const error = new Error("Contest end time must be after start time");
    error.statusCode = 400;
    throw error;
  }

  if (!problemIds.length) {
    const error = new Error("At least one problem is required");
    error.statusCode = 400;
    throw error;
  }

  await ensureProblemsExist(problemIds);

  const contest = await prisma.contest.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      startAt: startDate,
      endAt: endDate,
      isPublished: Boolean(isPublished),
      createdById,
      problems: {
        create: problemIds.map((problemId, index) => ({
          problemId,
          sortOrder: index,
        })),
      },
    },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
              tags: true,
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (contest.isPublished) {
    await scheduleContestReminders({
      contestId: contest.id,
      startAt: contest.startAt,
    });
  }

  return contest;
};

export const updateContestService = async ({
  contestId,
  title,
  description,
  startAt,
  endAt,
  isPublished,
  problemIds,
}) => {
  if (problemIds?.length) {
    await ensureProblemsExist(problemIds);
  }

  const contest = await prisma.contest.update({
    where: { id: contestId },
    data: {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(description !== undefined
        ? { description: description?.trim() || null }
        : {}),
      ...(startAt ? { startAt: new Date(startAt) } : {}),
      ...(endAt ? { endAt: new Date(endAt) } : {}),
      ...(typeof isPublished === "boolean" ? { isPublished } : {}),
      ...(problemIds
        ? {
            problems: {
              deleteMany: {},
              create: problemIds.map((problemId, index) => ({
                problemId,
                sortOrder: index,
              })),
            },
          }
        : {}),
    },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
              tags: true,
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (contest.isPublished) {
    await scheduleContestReminders({
      contestId: contest.id,
      startAt: contest.startAt,
    });
  }

  return contest;
};

export const listPublishedContestsService = async () => {
  return prisma.contest.findMany({
    where: { isPublished: true },
    include: {
      registrations: {
        select: { id: true },
      },
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { startAt: "asc" },
  });
};

export const listMyCreatedContestsService = async (userId) => {
  return prisma.contest.findMany({
    where: { createdById: userId },
    include: {
      registrations: {
        select: { id: true },
      },
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              difficulty: true,
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getContestByIdService = async ({ contestId, userId = null }) => {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: {
      registrations: {
        where: userId ? { userId } : undefined,
        select: { id: true, userId: true, createdAt: true },
      },
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              difficulty: true,
              tags: true,
              constraints: true,
              sampleInput: true,
              sampleOutput: true,
              explanation: true,
              isPremium: true,
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!contest) {
    const error = new Error("Contest not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...contest,
    isRegistered: !!contest.registrations?.length,
  };
};

export const registerForContestService = async ({ contestId, userId }) => {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      isPublished: true,
      startAt: true,
      endAt: true,
    },
  });

  if (!contest || !contest.isPublished) {
    const error = new Error("Contest not found");
    error.statusCode = 404;
    throw error;
  }

  if (new Date(contest.endAt).getTime() <= Date.now()) {
    const error = new Error("Contest already ended");
    error.statusCode = 400;
    throw error;
  }

  return prisma.contestRegistration.upsert({
    where: {
      contestId_userId: {
        contestId,
        userId,
      },
    },
    update: {},
    create: {
      contestId,
      userId,
    },
  });
};

export const deleteContestService = async (contestId) => {
  return prisma.contest.delete({
    where: { id: contestId },
  });
};