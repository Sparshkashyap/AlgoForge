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
    where: { activeDate: today },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          tags: true,
          isPremium: true,
        },
      },
    },
  });

  if (existing) return existing;

  const usedProblemIds = await prisma.dailyQuestion.findMany({
    select: { problemId: true },
  });

  const usedIds = usedProblemIds.map((item) => item.problemId);

  let problem = await prisma.problem.findFirst({
    where: {
      isPublished: true,
      id: {
        notIn: usedIds.length ? usedIds : undefined,
      },
    },
    orderBy: [
      { difficulty: "asc" },
      { createdAt: "desc" },
    ],
  });

  if (!problem) {
    problem = await prisma.problem.findFirst({
      where: { isPublished: true },
      orderBy: [
        { difficulty: "asc" },
        { createdAt: "desc" },
      ],
    });
  }

  if (!problem) {
    const error = new Error("No published problem available for daily question");
    error.statusCode = 400;
    throw error;
  }

  const dailyQuestion = await prisma.dailyQuestion.create({
    data: {
      problemId: problem.id,
      activeDate: today,
    },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          tags: true,
          isPremium: true,
        },
      },
    },
  });

  const users = await prisma.user.findMany({
    where: { isBlocked: false },
    select: { id: true },
  });

  await createBulkNotificationsForUsersService({
    userIds: users.map((u) => u.id),
    type: "DAILY_QUESTION",
    title: "Daily question is live",
    message: `${dailyQuestion.problem.title} is today's daily question.`,
    data: {
      dailyQuestionId: dailyQuestion.id,
      problemId: dailyQuestion.problem.id,
      slug: dailyQuestion.problem.slug,
      difficulty: dailyQuestion.problem.difficulty,
    },
  });

  return dailyQuestion;
};

export const getTodayDailyQuestionService = async () => {
  const today = getTodayDateOnly();

  let dailyQuestion = await prisma.dailyQuestion.findUnique({
    where: { activeDate: today },
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
          starterCode: true,
          languageTemplates: true,
          isPremium: true,
        },
      },
    },
  });

  if (!dailyQuestion) {
    dailyQuestion = await assignDailyQuestionService();
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

export const getMyDailyQuestionAttemptService = async ({
  userId,
  dailyQuestionId,
}) => {
  return prisma.userDailyQuestionAttempt.findUnique({
    where: {
      userId_dailyQuestionId: {
        userId,
        dailyQuestionId,
      },
    },
  });
};