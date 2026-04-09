import prisma from "../config/db.js";

const fakeJudgeResult = async ({ language, code }) => {
  if (!code || !language) {
    return {
      status: "Rejected",
      runtime: null,
      memory: null,
      passedCount: 0,
      totalCount: 0
    };
  }

  return {
    status: "Accepted",
    runtime: "32 ms",
    memory: "12 MB",
    passedCount: 12,
    totalCount: 12
  };
};

export const createSubmissionService = async ({ userId, problemId, language, code }) => {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId }
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const judgeResult = await fakeJudgeResult({ language, code });

  const submission = await prisma.submission.create({
    data: {
      userId,
      problemId,
      language,
      code,
      status: judgeResult.status,
      runtime: judgeResult.runtime,
      memory: judgeResult.memory,
      passedCount: judgeResult.passedCount,
      totalCount: judgeResult.totalCount
    }
  });

  if (judgeResult.status === "Accepted") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        solvedCount: {
          increment: 1
        }
      }
    });
  }

  return submission;
};

export const listMySubmissionsService = async (userId) => {
  return prisma.submission.findMany({
    where: { userId },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};