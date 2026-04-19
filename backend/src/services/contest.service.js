import prisma from "../config/db.js";
import { scheduleContestRemindersService } from "./notification.service.js";

export const createContestService = async ({
  title,
  description,
  startAt,
  endAt,
  isPublished,
  problemIds,
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

  const contest = await prisma.contest.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      startAt: startDate,
      endAt: endDate,
      isPublished: Boolean(isPublished),
      createdById,
      problems: {
        create: (problemIds || []).map((problemId, index) => ({
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
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
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
    await scheduleContestRemindersService({
      contestId: contest.id,
      startAt: contest.startAt,
    });
  }

  return contest;
};

export const listPublishedContestsService = async () => {
  return prisma.contest.findMany({
    where: {
      isPublished: true,
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
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      _count: {
        select: {
          registrations: true,
        },
      },
    },
    orderBy: {
      startAt: "asc",
    },
  });
};

export const getContestByIdService = async (contestId) => {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: {
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
        orderBy: {
          sortOrder: "asc",
        },
      },
      registrations: {
        select: {
          id: true,
          userId: true,
          createdAt: true,
        },
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

  return contest;
};

export const registerForContestService = async ({
  contestId,
  userId,
}) => {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    select: {
      id: true,
      title: true,
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

  const registration = await prisma.contestRegistration.upsert({
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

  return registration;
};