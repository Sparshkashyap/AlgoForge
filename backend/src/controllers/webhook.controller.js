import { verifyRazorpayWebhookSignature } from "../utils/verifyRazorpayWebhook.js";
import { applySubscriptionEventService } from "../services/billing.service.js";

const resolveTierFromPlanId = (planId) => {
  if (planId === process.env.RAZORPAY_STANDARD_PLAN_ID) return "STANDARD";
  if (planId === process.env.RAZORPAY_PRO_PLAN_ID) return "PRO";
  return "FREE";
};

export const razorpayWebhookController = async (req, res, next) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.rawBody;

    const valid = verifyRazorpayWebhookSignature(rawBody, signature);

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event?.startsWith("subscription.")) {
      const entity = payload?.subscription?.entity;

      if (entity?.id) {
        await applySubscriptionEventService({
          subscriptionId: entity.id,
          status: entity.status,
          plan: resolveTierFromPlanId(entity.plan_id),
          currentEndAt: entity.current_end,
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};