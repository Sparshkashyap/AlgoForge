import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import {
  getPaymentAuditByEventIdService,
  markPaymentAuditFailedService,
  markPaymentAuditProcessedService,
} from "../services/paymentAudit.service.js";
import { processRazorpayWebhookEventService } from "../services/billing.service.js";

const parsePayload = (payload) => {
  if (typeof payload === "string") {
    return JSON.parse(payload);
  }

  return payload;
};

const handleRetryPaymentEvent = async (job) => {
  const { eventId } = job.data;

  const audit = await getPaymentAuditByEventIdService(eventId);
  if (!audit) {
    throw new Error("Payment audit not found");
  }

  if (audit.status === "PROCESSED") {
    return { skipped: true, eventId };
  }

  try {
    const payload = parsePayload(audit.payload);

    await processRazorpayWebhookEventService(payload);
    await markPaymentAuditProcessedService(eventId);

    return { processed: true, eventId };
  } catch (error) {
    await markPaymentAuditFailedService({
      eventId,
      errorMessage: error.message,
    });

    throw error;
  }
};

export const paymentWorker = new Worker(
  "payment-jobs",
  async (job) => {
    if (job.name === "retry-payment-event") {
      return handleRetryPaymentEvent(job);
    }

    throw new Error(`Unknown payment job: ${job.name}`);
  },
  {
    connection: redisConnection,
    concurrency: 2,
  }
);

paymentWorker.on("completed", (job) => {
  console.log(`Payment worker completed job ${job.id} (${job.name})`);
});

paymentWorker.on("failed", (job, error) => {
  console.error(
    `Payment worker failed job ${job?.id} (${job?.name}):`,
    error.message
  );
});