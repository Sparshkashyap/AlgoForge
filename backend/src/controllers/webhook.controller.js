import crypto from "crypto";
import env from "../config/env.js";
import { paymentQueue } from "../queues/payment.queue.js";
import {
  createPaymentAuditService,
  getPaymentAuditByEventIdService,
  markPaymentAuditFailedService,
  markPaymentAuditProcessedService,
} from "../services/paymentAudit.service.js";
import { processRazorpayWebhookEventService } from "../services/billing.service.js";

const verifySignature = (rawBody, signature) => {
  const digest = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return digest === signature;
};

export const razorpayWebhookController = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.rawBody;

    if (!signature || !rawBody) {
      return res.status(400).json({
        success: false,
        message: "Missing signature or body",
      });
    }

    if (!verifySignature(rawBody, signature)) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const payload = JSON.parse(rawBody);

    const alreadyProcessed = await getPaymentAuditByEventIdService(payload.id);
    if (alreadyProcessed) {
      return res.status(200).json({
        success: true,
        message: "Duplicate webhook ignored",
      });
    }

    await createPaymentAuditService({
      eventId: payload.id,
      type: payload.event,
      payload,
      status: "RECEIVED",
    });

    try {
      await processRazorpayWebhookEventService(payload);
      await markPaymentAuditProcessedService(payload.id);

      return res.status(200).json({
        success: true,
        message: "Webhook processed",
      });
    } catch (error) {
      await markPaymentAuditFailedService({
        eventId: payload.id,
        errorMessage: error.message,
      });

      await paymentQueue.add(
        "retry-payment-event",
        {
          eventId: payload.id,
        },
        {
          jobId: `payment-retry:${payload.id}`,
        }
      );

      return res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected webhook error",
    });
  }
};