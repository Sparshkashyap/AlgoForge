import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

export const executionQueue = new Queue("execution-jobs", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: "exponential",
      delay: 3000,
    },
    removeOnComplete: 200,
    removeOnFail: 200,
  },
});