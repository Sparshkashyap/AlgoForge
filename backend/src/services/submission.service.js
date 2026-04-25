import prisma from "../config/db.js";
import { executionQueue } from "../queues/execution.queue.js";
import { getLanguageId } from "./judge.service.js";

/**
 * 🔥 Safe Job ID Generator (BullMQ compatible)
 */
const safeJobId = (value) => {
  return String(value || Date.now())
    .replace(/:/g, "-")                    // remove colon
    .replace(/[^a-zA-Z0-9_-]/g, "-")      // remove unsafe chars
    .replace(/-+/g, "-")                  // collapse dashes
    .slice(0, 180);                      // limit length
};

/**
 * 🔐 Check premium access
 */
const checkAccess = (user, problem) => {
  return (
    !problem.isPremium ||
    user.role === "ADMIN" ||
    ["STANDARD", "PRO"].includes(user.plan)
  );
};

/**
 * 🚀 Create submission
 */
export const createSubmissionService = async ({
  problemId,
  language,
  code,
  userId,
}) => {
  // 👤 Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, plan: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // 📘 Get problem + testcases
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

  // 🔐 Premium check
  if (!checkAccess(user, problem)) {
    const error = new Error("Upgrade to a premium plan to access this problem");
    error.statusCode = 403;
    throw error;
  }

  // ❗ Ensure testcases exist
  if (!problem.testCases.length) {
    const error = new Error("Problem has no test cases configured");
    error.statusCode = 400;
    throw error;
  }

  // 📝 Create submission
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

  // ⚙️ Queue execution (FIXED jobId)
  await executionQueue.add(
    "execute-submission",
    {
      submissionId: submission.id,
    },
    {
      jobId: safeJobId(`submission-${submission.id}`),
    }
  );

  return submission;
};

/**
 * 📜 List user submissions
 */
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

/**
 * 🔍 Get submission by ID
 */
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