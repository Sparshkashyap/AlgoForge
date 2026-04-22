import { Worker } from "bullmq";
import prisma from "../config/db.js";
import redisConnection from "../config/redis.js";
import {
  sendContestReminderEmail,
  sendDailyDigestEmail,
} from "../services/email.service.js";
import { assignDailyQuestionService } from "../services/dailyQuestion.service.js";
import { emitToUser } from "../services/socket.service.js";

console.log("Notification worker initialized");

const CHUNK_SIZE = 500;

const chunkArray = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const emitBulk = (list) => {
  for (const item of list) {
    if (!item?.userId) continue;
    emitToUser(item.userId, "notification:new", item);
  }
};

const handleProblemPublishedFanout = async (job) => {
  const { problemId, title, slug, difficulty } = job.data;

  const users = await prisma.user.findMany({
    where: { isBlocked: false },
    select: { id: true },
  });

  const rows = users.map((u) => ({
    userId: u.id,
    type: "NEW_PROBLEM",
    title: "New problem launched",
    message: `${title} is now live.`,
    data: { problemId, slug, difficulty },
  }));

  for (const chunk of chunkArray(rows, CHUNK_SIZE)) {
    await prisma.notification.createMany({ data: chunk });
    emitBulk(chunk);
  }

  return { delivered: rows.length };
};

const handleDailyDigest = async () => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    where: { isBlocked: false },
    select: { id: true, name: true, email: true },
  });

  let sent = 0;

  for (const user of users) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        isRead: false,
        createdAt: { gte: since },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (!notifications.length) continue;

    await sendDailyDigestEmail({
      to: user.email,
      name: user.name,
      notifications,
    });

    sent++;
  }

  return { digestSentTo: sent };
};

const handleContestReminder = async (job) => {
  const { contestId, reminderMinutes } = job.data;

  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: {
      registrations: {
        include: {
          user: {
            select: { id: true, name: true, email: true, isBlocked: true },
          },
        },
      },
    },
  });

  if (!contest || !contest.isPublished) return { skipped: true };

  const active = contest.registrations.filter((r) => !r.user.isBlocked);
  if (!active.length) return { delivered: 0 };

  const label =
    reminderMinutes >= 60
      ? `${Math.round(reminderMinutes / 60)} hour(s)`
      : `${reminderMinutes} minute(s)`;

  const rows = active.map((r) => ({
    userId: r.user.id,
    type: "CONTEST_REMINDER",
    title: "Contest reminder",
    message: `${contest.title} starts soon.`,
    data: {
      contestId: contest.id,
      reminderMinutes,
      startAt: contest.startAt,
    },
  }));

  for (const chunk of chunkArray(rows, CHUNK_SIZE)) {
    await prisma.notification.createMany({ data: chunk });
    emitBulk(chunk);
  }

  await Promise.all(
    active.map((r) =>
      sendContestReminderEmail({
        to: r.user.email,
        name: r.user.name,
        contestTitle: contest.title,
        startAt: contest.startAt,
        reminderLabel: label,
      })
    )
  );

  return { delivered: active.length };
};

const handleDailyQuestionAssignment = async () => {
  const dailyQuestion = await assignDailyQuestionService();

  const notifications = await prisma.notification.findMany({
    where: {
      type: "DAILY_QUESTION",
      createdAt: {
        gte: new Date(Date.now() - 5 * 60 * 1000),
      },
      data: {
        path: ["dailyQuestionId"],
        equals: dailyQuestion.id,
      },
    },
    take: 5000,
  });

  emitBulk(notifications);

  return {
    dailyQuestionId: dailyQuestion.id,
    problemId: dailyQuestion.problemId,
  };
};

export const notificationWorker = new Worker(
  "notification-jobs",
  async (job) => {
    switch (job.name) {
      case "problem-published-fanout":
        return handleProblemPublishedFanout(job);
      case "daily-digest":
        return handleDailyDigest(job);
      case "contest-reminder":
        return handleContestReminder(job);
      case "daily-question-assignment":
        return handleDailyQuestionAssignment(job);
      default:
        throw new Error(`Unknown job: ${job.name}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

notificationWorker.on("completed", (job) => {
  console.log(`Completed ${job.id} (${job.name})`);
});

notificationWorker.on("failed", (job, err) => {
  console.error(`Failed ${job?.id} (${job?.name}):`, err.message);
});