import { Queue } from "bullmq";
import redisConnection from "../config/redis.js";

export const paymentQueue = new Queue("payment-jobs", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 10000,
    },
    removeOnComplete: 200,
    removeOnFail: 200,
  },
});