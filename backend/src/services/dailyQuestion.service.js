import prisma from "../config/db.js";
import { createBulkNotificationsForUsersService } from "./notification.service.js";

const getTodayDateOnly = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export const assignDailyQuestionService = async () => {
  const today = getTodayDateOnly();

  const existing = await prisma.dailyQuestion.findUnique({
    where: {
      activeDate: today,
    },
    include: {
      problem: true,
    },
  });

  if (existing) {
    return existing;
  }

  const alreadyUsedProblemIds = (
    await prisma.dailyQuestion.findMany({
      select: {
        problemId: true,
      },
    })
  ).map((item) => item.problemId);

  let selectedProblem = await prisma.problem.findFirst({
    where: {
      isPublished: true,
      id: {
        notIn: alreadyUsedProblemIds.length ? alreadyUsedProblemIds : undefined,
      },
    },
    orderBy: [
      { difficulty: "asc" },
      { createdAt: "desc" },
    ],
  });

  if (!selectedProblem) {
    selectedProblem = await prisma.problem.findFirst({
      where: {
        isPublished: true,
      },
      orderBy: [
        { difficulty: "asc" },
        { createdAt: "desc" },
      ],
    });
  }

  if (!selectedProblem) {
    const error = new Error("No published problem available for daily question");
    error.statusCode = 400;
    throw error;
  }

  const dailyQuestion = await prisma.dailyQuestion.create({
    data: {
      problemId: selectedProblem.id,
      activeDate: today,
    },
    include: {
      problem: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      isBlocked: false,
    },
    select: {
      id: true,
    },
  });

  await createBulkNotificationsForUsersService({
    userIds: users.map((user) => user.id),
    type: "DAILY_QUESTION",
    title: "Daily question is live",
    message: `${selectedProblem.title} is today's daily question.`,
    data: {
      dailyQuestionId: dailyQuestion.id,
      problemId: selectedProblem.id,
      slug: selectedProblem.slug,
      difficulty: selectedProblem.difficulty,
    },
  });

  return dailyQuestion;
};

export const getActiveDailyQuestionService = async () => {
  const today = getTodayDateOnly();

  let dailyQuestion = await prisma.dailyQuestion.findUnique({
    where: {
      activeDate: today,
    },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          difficulty: true,
          tags: true,
          sampleInput: true,
          sampleOutput: true,
          explanation: true,
          constraints: true,
          isPremium: true,
        },
      },
    },
  });

  if (!dailyQuestion) {
    dailyQuestion = await assignDailyQuestionService();
    dailyQuestion = await prisma.dailyQuestion.findUnique({
      where: {
        activeDate: today,
      },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            difficulty: true,
            tags: true,
            sampleInput: true,
            sampleOutput: true,
            explanation: true,
            constraints: true,
            isPremium: true,
          },
        },
      },
    });
  }

  return dailyQuestion;
};

export const markDailyQuestionAttemptService = async ({
  userId,
  dailyQuestionId,
  status,
}) => {
  return prisma.userDailyQuestionAttempt.upsert({
    where: {
      userId_dailyQuestionId: {
        userId,
        dailyQuestionId,
      },
    },
    update: {
      status,
      attemptedAt: new Date(),
    },
    create: {
      userId,
      dailyQuestionId,
      status,
    },
  });
};