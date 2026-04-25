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

const sanitizeJobId = (value) => {
  return String(value || Date.now())
    .replace(/:/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 180);
};

const getSafeWebhookEventId = (payload) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const subscriptionId = payload?.payload?.subscription?.entity?.id;
  const paymentId = payload?.payload?.payment?.entity?.id;
  const invoiceId = payload?.payload?.invoice?.entity?.id;
  const rootId = payload?.id;
  const eventType = payload?.event || "unknown";

  const baseId = subscriptionId || paymentId || invoiceId || rootId;

  if (!baseId) {
    return null;
  }

  return `${eventType}-${baseId}`;
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
    const eventId = getSafeWebhookEventId(payload);

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "Webhook event id could not be derived",
      });
    }

    const alreadyProcessed = await getPaymentAuditByEventIdService(eventId);

    if (alreadyProcessed) {
      return res.status(200).json({
        success: true,
        message: "Duplicate webhook ignored",
      });
    }

    await createPaymentAuditService({
      eventId,
      type: payload.event || "unknown",
      payload,
      status: "RECEIVED",
    });

    try {
      await processRazorpayWebhookEventService(payload);
      await markPaymentAuditProcessedService(eventId);

      return res.status(200).json({
        success: true,
        message: "Webhook processed",
      });
    } catch (error) {
      await markPaymentAuditFailedService({
        eventId,
        errorMessage: error.message,
      });

      const retryJobId = sanitizeJobId(`payment-retry-${eventId}`);

      await paymentQueue.add(
        "retry-payment-event",
        {
          eventId,
        },
        {
          jobId: retryJobId,
        }
      );

      return res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    }
  } catch (error) {
    console.error("Unexpected Razorpay webhook error:", error);

    return res.status(500).json({
      success: false,
      message: "Unexpected webhook error",
    });
  }
};