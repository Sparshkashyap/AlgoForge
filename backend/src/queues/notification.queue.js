import { Queue } from "bullmq";
import env from "../config/env.js";
import redisConnection from "../config/redis.js";

export const notificationQueue = new Queue("notification-jobs", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 500,
    removeOnFail: 500,
  },
});

export const enqueuePublishedProblemFanoutJob = async ({
  problemId,
  title,
  slug,
  difficulty,
}) => {
  return notificationQueue.add(
    "problem-published-fanout",
    {
      problemId,
      title,
      slug,
      difficulty,
    },
    {
      jobId: `problem-published:${problemId}`,
    }
  );
};

export const enqueueContestReminderJob = async ({
  contestId,
  reminderMinutes,
  sendAt,
}) => {
  const delay = Math.max(new Date(sendAt).getTime() - Date.now(), 0);

  return notificationQueue.add(
    "contest-reminder",
    {
      contestId,
      reminderMinutes,
    },
    {
      delay,
      jobId: `contest-reminder:${contestId}:${reminderMinutes}`,
    }
  );
};

export const enqueueDailyQuestionAssignmentJob = async () => {
  return notificationQueue.add(
    "daily-question-assignment",
    {},
    {
      jobId: `daily-question:manual:${Date.now()}`,
    }
  );
};

export const bootstrapNotificationSchedulers = async () => {
  await notificationQueue.upsertJobScheduler(
    "daily-digest-scheduler",
    {
      pattern: env.DAILY_DIGEST_CRON,
    },
    {
      name: "daily-digest",
      data: {},
      opts: {
        removeOnComplete: 100,
        removeOnFail: 100,
        attempts: 2,
      },
    }
  );

  await notificationQueue.upsertJobScheduler(
    "daily-question-scheduler",
    {
      pattern: "0 5 0 * * *",
    },
    {
      name: "daily-question-assignment",
      data: {},
      opts: {
        removeOnComplete: 100,
        removeOnFail: 100,
        attempts: 2,
      },
    }
  );
};