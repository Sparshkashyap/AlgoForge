import { Worker } from "bullmq";
import prisma from "../config/db.js";
import redisConnection from "../config/redis.js";
import { buildExecutableCode } from "../utils/codeWrapper.js";
import { judgeSubmission } from "../services/judge.service.js";
import { evaluateUserBadgesService } from "../services/badge.service.js";
import { createNotificationService } from "../services/notification.service.js";
import { emitToUser } from "../services/socket.service.js";

const startOfDay = (d) => new Date(d.setHours(0, 0, 0, 0));
const diffDays = (a, b) =>
  Math.round((startOfDay(a) - startOfDay(b)) / (1000 * 60 * 60 * 24));

const updateStats = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { solvedCount: true, streak: true, lastSolvedAt: true },
  });

  if (!user) return { solvedCount: 0, streak: 0, streakChanged: false };

  const now = new Date();
  let streak = user.streak || 0;
  let changed = false;

  if (!user.lastSolvedAt) {
    streak = 1;
    changed = true;
  } else {
    const d = diffDays(now, user.lastSolvedAt);
    if (d >= 1) {
      streak = d === 1 ? streak + 1 : 1;
      changed = true;
    }
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      solvedCount: { increment: 1 },
      streak,
      lastSolvedAt: now,
    },
    select: { solvedCount: true, streak: true },
  });

  return { ...updated, streakChanged: changed };
};

const notify = async (payload) => {
  const n = await createNotificationService(payload);
  emitToUser(payload.userId, "notification:new", n);
};

const handleExecutionJob = async (job) => {
  const { submissionId } = job.data;

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: {
      user: { select: { id: true } },
      problem: {
        include: { testCases: { orderBy: { createdAt: "asc" } } },
      },
    },
  });

  if (!submission) throw new Error("Submission not found");

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: "PROCESSING", verdict: "Processing" },
  });

  emitToUser(submission.userId, "submission:update", {
    id: submissionId,
    status: "PROCESSING",
    verdict: "Processing",
  });

  const code = buildExecutableCode({
    language: submission.language,
    userCode: submission.code,
    driverCode: submission.problem.driverCode?.[submission.language] ?? "",
  });

  const result = await judgeSubmission({
    language: submission.language,
    code,
    testCases: submission.problem.testCases,
  });

  const updated = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: "COMPLETED",
      verdict: result.verdict,
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      runtime: result.runtime ? String(result.runtime) : null,
      memory: result.memory,
      passedCount: result.passedCount,
      totalCount: result.totalCount,
    },
    include: {
      problem: {
        select: { id: true, title: true, slug: true, difficulty: true },
      },
    },
  });

  emitToUser(updated.userId, "submission:update", updated);

  if (updated.verdict === "Accepted") {
    const exists = await prisma.submission.count({
      where: {
        userId: updated.userId,
        problemId: updated.problemId,
        verdict: "Accepted",
        id: { not: updated.id },
      },
    });

    if (!exists) {
      const progress = await updateStats(updated.userId);

      await notify({
        userId: updated.userId,
        type: "PROBLEM_SOLVED",
        title: "Problem solved",
        message: `You solved ${updated.problem.title}.`,
        data: {
          problemId: updated.problem.id,
          slug: updated.problem.slug,
          difficulty: updated.problem.difficulty,
          totalSolved: progress.solvedCount,
        },
      });

      if (progress.streakChanged) {
        await notify({
          userId: updated.userId,
          type: "STREAK_UPDATED",
          title: "Streak updated",
          message: `Streak: ${progress.streak} day${progress.streak > 1 ? "s" : ""}`,
          data: { streak: progress.streak },
        });

        if ([3, 7, 30, 50, 100].includes(progress.streak)) {
          await notify({
            userId: updated.userId,
            type: "STREAK_MILESTONE",
            title: "Milestone reached",
            message: `${progress.streak}-day streak achieved`,
            data: { streak: progress.streak },
          });
        }
      }

      const badges = await evaluateUserBadgesService(updated.userId);

      await Promise.all(
        badges.map((b) =>
          notify({
            userId: updated.userId,
            type: "BADGE_AWARDED",
            title: "New badge",
            message: `Earned "${b.title}" badge`,
            data: { badgeCode: b.code, badgeTitle: b.title },
          })
        )
      );
    }
  }

  return { submissionId: updated.id, verdict: updated.verdict };
};

export const executionWorker = new Worker(
  "execution-jobs",
  async (job) => {
    if (job.name === "execute-submission") {
      return handleExecutionJob(job);
    }
    throw new Error(`Unknown job: ${job.name}`);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

executionWorker.on("completed", (job) => {
  console.log(`Completed ${job.id} (${job.name})`);
});

executionWorker.on("failed", async (job, err) => {
  console.error(`Failed ${job?.id} (${job?.name}):`, err.message);

  const id = job?.data?.submissionId;
  if (!id) return;

  const failed = await prisma.submission.update({
    where: { id },
    data: {
      status: "FAILED",
      verdict: "Failed",
      stderr: err.message,
    },
  });

  emitToUser(failed.userId, "submission:update", failed);
});