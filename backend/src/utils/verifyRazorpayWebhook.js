import crypto from "crypto";
import env from "../config/env.js";

export const verifyRazorpayWebhookSignature = (rawBody, signature) => {
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  return expected === signature;
};