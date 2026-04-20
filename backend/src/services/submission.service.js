import prisma from "../config/db.js";
import { executionQueue } from "../queues/execution.queue.js";
import { getLanguageId } from "./judge.service.js";

const checkAccess = (user, problem) => {
  return (
    !problem.isPremium ||
    user.role === "ADMIN" ||
    ["STANDARD", "PRO"].includes(user.plan)
  );
};

export const createSubmissionService = async ({
  problemId,
  language,
  code,
  userId,
}) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, plan: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const problem = await prisma.problem.findFirst({
    where: {
      id: problemId,
      isPublished: true,
    },
    include: {
      testCases: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  if (!checkAccess(user, problem)) {
    const error = new Error("Upgrade to a premium plan to access this problem");
    error.statusCode = 403;
    throw error;
  }

  if (!problem.testCases.length) {
    const error = new Error("Problem has no test cases configured");
    error.statusCode = 400;
    throw error;
  }

  const submission = await prisma.submission.create({
    data: {
      userId,
      problemId,
      language,
      languageId: getLanguageId(language),
      code,
      status: "QUEUED",
      verdict: "Queued",
      totalCount: problem.testCases.length,
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

  await executionQueue.add(
    "execute-submission",
    {
      submissionId: submission.id,
    },
    {
      jobId: `submission:${submission.id}`,
    }
  );

  return submission;
};

export const listMySubmissionsService = async (userId) => {
  return prisma.submission.findMany({
    where: {
      userId,
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
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getSubmissionByIdForUserService = async ({
  submissionId,
  userId,
}) => {
  const submission = await prisma.submission.findFirst({
    where: {
      id: submissionId,
      userId,
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

  if (!submission) {
    const error = new Error("Submission not found");
    error.statusCode = 404;
    throw error;
  }

  return submission;
};