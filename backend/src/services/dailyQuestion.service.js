import prisma from "../config/db.js";
import {
  createBulkNotificationsForUsersService,
  dispatchNotificationEventService,
} from "./notification.service.js";

const getStartOfDay = (input = new Date()) => {
  const date = new Date(input);
  date.setHours(0, 0, 0, 0);
  return date;
};

const dailyQuestionProblemListSelect = {
  id: true,
  title: true,
  slug: true,
  difficulty: true,
  tags: true,
  isPremium: true,
};

const dailyQuestionProblemDetailSelect = {
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
};

export const getLatestDailyQuestionService = async () => {
  return prisma.dailyQuestion.findFirst({
    orderBy: {
      activeDate: "desc",
    },
    include: {
      problem: {
        select: dailyQuestionProblemListSelect,
      },
    },
  });
};

export const assignDailyQuestionService = async () => {
  const today = getStartOfDay();

  const existing = await prisma.dailyQuestion.findUnique({
    where: { activeDate: today },
    include: {
      problem: {
        select: dailyQuestionProblemListSelect,
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
    orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
  });

  if (!problem) {
    problem = await prisma.problem.findFirst({
      where: {
        isPublished: true,
      },
      orderBy: [{ difficulty: "asc" }, { createdAt: "desc" }],
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
        select: dailyQuestionProblemListSelect,
      },
    },
  });

  const users = await prisma.user.findMany({
    where: { isBlocked: false },
    select: { id: true },
  });

  await createBulkNotificationsForUsersService({
    userIds: users.map((user) => user.id),
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

export const publishDailyQuestionService = async ({
  actorUserId,
  problemId,
  activeDate,
}) => {
  const normalizedDate = getStartOfDay(activeDate ? new Date(activeDate) : new Date());

  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      isPublished: true,
      isPremium: true,
      tags: true,
    },
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  if (!problem.isPublished) {
    const error = new Error("Only published problems can be daily questions");
    error.statusCode = 400;
    throw error;
  }

  const alreadyExisting = await prisma.dailyQuestion.findUnique({
    where: { activeDate: normalizedDate },
    select: {
      id: true,
      problemId: true,
    },
  });

  const dailyQuestion = await prisma.dailyQuestion.upsert({
    where: {
      activeDate: normalizedDate,
    },
    update: {
      problemId,
    },
    create: {
      problemId,
      activeDate: normalizedDate,
    },
    include: {
      problem: {
        select: dailyQuestionProblemListSelect,
      },
    },
  });

  await dispatchNotificationEventService({
    event: "DAILY_QUESTION_PUBLISHED",
    actorUserId,
    payload: {
      dailyQuestionId: dailyQuestion.id,
      problemId: dailyQuestion.problem.id,
      problemSlug: dailyQuestion.problem.slug || null,
      problemTitle: dailyQuestion.problem.title,
      difficulty: dailyQuestion.problem.difficulty,
      activeDate: normalizedDate,
      wasUpdated: Boolean(alreadyExisting),
    },
  });

  return dailyQuestion;
};

export const getTodayDailyQuestionService = async () => {
  const today = getStartOfDay();

  let dailyQuestion = await prisma.dailyQuestion.findUnique({
    where: { activeDate: today },
    include: {
      problem: {
        select: dailyQuestionProblemDetailSelect,
      },
    },
  });

  if (!dailyQuestion) {
    const assigned = await assignDailyQuestionService();

    dailyQuestion = await prisma.dailyQuestion.findUnique({
      where: { id: assigned.id },
      include: {
        problem: {
          select: dailyQuestionProblemDetailSelect,
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