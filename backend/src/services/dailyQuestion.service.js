import prisma from "../config/db.js";

const startOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const assignDailyQuestionService = async () => {
  const today = startOfDay();

  const existing = await prisma.dailyQuestion.findUnique({
    where: { activeDate: today },
    include: { problem: true },
  });

  if (existing) return existing;

  const candidates = await prisma.problem.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  if (!candidates.length) {
    const error = new Error("No published problems available");
    error.statusCode = 400;
    throw error;
  }

  const randomProblem =
    candidates[Math.floor(Math.random() * candidates.length)];

  return prisma.dailyQuestion.create({
    data: {
      problemId: randomProblem.id,
      activeDate: today,
    },
    include: { problem: true },
  });
};

export const getDailyQuestionService = async (userId = null) => {
  const today = startOfDay();

  let daily = await prisma.dailyQuestion.findUnique({
    where: { activeDate: today },
    include: { problem: true },
  });

  if (!daily) {
    daily = await assignDailyQuestionService();
  }

  let myAttempt = null;

  if (userId) {
    myAttempt = await prisma.userDailyQuestionAttempt.findFirst({
      where: {
        userId,
        dailyQuestionId: daily.id,
      },
    });
  }

  return {
    daily,
    myAttempt,
  };
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