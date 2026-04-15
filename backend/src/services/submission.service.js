import prisma from "../config/db.js";
import { judgeSubmission, getLanguageId } from "./judge.service.js";
import { buildExecutableCode } from "../utils/codeWrapper.js";

export const createSubmissionService = async ({
  problemId,
  language,
  code,
  userId,
}) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      plan: true,
    },
  });

  const problem = await prisma.problem.findFirst({
    where: {
      id: problemId,
      isPublished: true,
    },
    include: {
      testCases: true,
    },
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const hasPremiumAccess =
    !problem.isPremium || user?.role === "ADMIN" || user?.plan === "PRO";

  if (!hasPremiumAccess) {
    const error = new Error("Upgrade to Pro to access this problem");
    error.statusCode = 403;
    throw error;
  }

  if (!problem.testCases.length) {
    const error = new Error("Problem has no test cases configured");
    error.statusCode = 400;
    throw error;
  }

  const executableCode = buildExecutableCode({
    language,
    userCode: code,
    driverCode: problem.driverCode?.[language],
  });

  const languageId = getLanguageId(language);

  const pendingSubmission = await prisma.submission.create({
    data: {
      userId,
      problemId,
      language,
      languageId,
      code,
      status: "Pending",
      verdict: "Pending",
    },
  });

  const judgeResult = await judgeSubmission({
    language,
    code: executableCode,
    testCases: problem.testCases,
  });

  const submission = await prisma.submission.update({
    where: {
      id: pendingSubmission.id,
    },
    data: {
      status: judgeResult.status,
      verdict: judgeResult.verdict,
      stdout: judgeResult.stdout,
      stderr: judgeResult.stderr,
      compileOutput: judgeResult.compileOutput,
      runtime: judgeResult.runtime ? String(judgeResult.runtime) : null,
      memory: judgeResult.memory,
      passedCount: judgeResult.passedCount,
      totalCount: judgeResult.totalCount,
    },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          tags: true,
          isPremium: true,
        },
      },
    },
  });

  if (submission.verdict === "Accepted") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        solvedCount: {
          increment: 1,
        },
      },
    });
  }

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