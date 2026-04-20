import { Worker } from "bullmq";
import prisma from "../config/db.js";
import redisConnection from "../config/redis.js";
import { buildExecutableCode } from "../utils/codeWrapper.js";
import { judgeSubmission } from "../services/judge.service.js";
import { evaluateUserBadgesService } from "../services/badge.service.js";
import { createNotificationService } from "../services/notification.service.js";
import { emitToUser } from "../services/socket.service.js";

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const differenceInDays = (dateA, dateB) => {
  const a = startOfDay(dateA).getTime();
  const b = startOfDay(dateB).getTime();
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
};

const updateSolvedStatsAndStreak = async ({ userId }) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      solvedCount: true,
      streak: true,
      lastSolvedAt: true,
    },
  });

  if (!user) return { solvedCount: 0, streak: 0, streakChanged: false };

  const now = new Date();

  let nextStreak = user.streak || 0;
  let streakChanged = false;

  if (!user.lastSolvedAt) {
    nextStreak = 1;
    streakChanged = true;
  } else {
    const dayDiff = differenceInDays(now, user.lastSolvedAt);

    if (dayDiff >= 1) {
      nextStreak = dayDiff === 1 ? (user.streak || 0) + 1 : 1;
      streakChanged = true;
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      solvedCount: {
        increment: 1,
      },
      streak: nextStreak,
      lastSolvedAt: now,
    },
    select: {
      solvedCount: true,
      streak: true,
    },
  });

  return {
    solvedCount: updatedUser.solvedCount,
    streak: updatedUser.streak,
    streakChanged,
  };
};

const queueAndEmitNotification = async ({
  userId,
  type,
  title,
  message,
  data = null,
}) => {
  const notification = await createNotificationService({
    userId,
    type,
    title,
    message,
    data,
  });

  emitToUser(userId, "notification:new", notification);

  return notification;
};

const handleExecutionJob = async (job) => {
  const { submissionId } = job.data;

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      user: {
        select: {
          id: true,
        },
      },
      problem: {
        include: {
          testCases: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  if (!submission) {
    throw new Error("Submission not found");
  }

  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "PROCESSING",
      verdict: "Processing",
    },
  });

  emitToUser(submission.userId, "submission:update", {
    id: submissionId,
    status: "PROCESSING",
    verdict: "Processing",
  });

  const executableCode = buildExecutableCode({
    language: submission.language,
    userCode: submission.code,
    driverCode: submission.problem.driverCode?.[submission.language] ?? "",
  });

  const judgeResult = await judgeSubmission({
    language: submission.language,
    code: executableCode,
    testCases: submission.problem.testCases,
  });

  const updatedSubmission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "COMPLETED",
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
          difficulty: true,
          tags: true,
          isPremium: true,
        },
      },
    },
  });

  emitToUser(updatedSubmission.userId, "submission:update", updatedSubmission);

  if (updatedSubmission.verdict === "Accepted") {
    const alreadyAccepted = await prisma.submission.count({
      where: {
        userId: updatedSubmission.userId,
        problemId: updatedSubmission.problemId,
        verdict: "Accepted",
        id: {
          not: updatedSubmission.id,
        },
      },
    });

    if (alreadyAccepted === 0) {
      const progress = await updateSolvedStatsAndStreak({
        userId: updatedSubmission.userId,
      });

      await queueAndEmitNotification({
        userId: updatedSubmission.userId,
        type: "PROBLEM_SOLVED",
        title: "Problem solved",
        message: `You solved ${updatedSubmission.problem?.title}.`,
        data: {
          problemId: updatedSubmission.problem?.id,
          slug: updatedSubmission.problem?.slug,
          difficulty: updatedSubmission.problem?.difficulty,
          totalSolved: progress.solvedCount,
        },
      });

      if (progress.streakChanged) {
        await queueAndEmitNotification({
          userId: updatedSubmission.userId,
          type: "STREAK_UPDATED",
          title: "Streak updated",
          message: `Your current streak is now ${progress.streak} day${progress.streak > 1 ? "s" : ""}.`,
          data: {
            streak: progress.streak,
          },
        });

        const milestones = [3, 7, 30, 50, 100];
        if (milestones.includes(progress.streak)) {
          await queueAndEmitNotification({
            userId: updatedSubmission.userId,
            type: "STREAK_MILESTONE",
            title: "Streak milestone reached",
            message: `You reached a ${progress.streak}-day streak.`,
            data: {
              streak: progress.streak,
            },
          });
        }
      }

      const newlyAwardedBadges = await evaluateUserBadgesService(
        updatedSubmission.userId
      );

      for (const badge of newlyAwardedBadges) {
        await queueAndEmitNotification({
          userId: updatedSubmission.userId,
          type: "BADGE_AWARDED",
          title: "New badge earned",
          message: `You earned the "${badge.title}" badge.`,
          data: {
            badgeCode: badge.code,
            badgeTitle: badge.title,
          },
        });
      }
    }
  }

  return {
    submissionId: updatedSubmission.id,
    verdict: updatedSubmission.verdict,
  };
};

export const executionWorker = new Worker(
  "execution-jobs",
  async (job) => {
    switch (job.name) {
      case "execute-submission":
        return handleExecutionJob(job);
      default:
        throw new Error(`Unknown execution job name: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

executionWorker.on("completed", (job) => {
  console.log(`Execution worker completed job ${job.id} (${job.name})`);
});

executionWorker.on("failed", async (job, error) => {
  console.error(
    `Execution worker failed job ${job?.id} (${job?.name}):`,
    error.message
  );

  const submissionId = job?.data?.submissionId;

  if (submissionId) {
    const failedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: "FAILED",
        verdict: "Failed",
        stderr: error.message,
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

    emitToUser(failedSubmission.userId, "submission:update", failedSubmission);
  }
});