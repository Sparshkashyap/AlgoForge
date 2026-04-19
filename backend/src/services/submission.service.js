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
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const problem = await prisma.problem.findFirst({
    where: { id: problemId, isPublished: true },
    include: {
      testCases: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!problem) {
    const err = new Error("Problem not found");
    err.statusCode = 404;
    throw err;
  }

  if (!checkAccess(user, problem)) {
    const err = new Error("Upgrade to premium to access this problem");
    err.statusCode = 403;
    throw err;
  }

  if (!problem.testCases.length) {
    const err = new Error("No test cases configured");
    err.statusCode = 400;
    throw err;
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
    { submissionId: submission.id },
    { jobId: `submission:${submission.id}` }
  );

  return submission;
};

export const listMySubmissionsService = (userId) =>
  prisma.submission.findMany({
    where: { userId },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          tags: true,
          isPremium: true,
          difficulty: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

export const getSubmissionByIdForUserService = async ({
  submissionId,
  userId,
}) => {
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, userId },
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
    const err = new Error("Submission not found");
    err.statusCode = 404;
    throw err;
  }

  return submission;
};