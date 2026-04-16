import Razorpay from "razorpay";
import env from "../config/env.js";

const hasRazorpayKeys =
  Boolean(env.RAZORPAY_KEY_ID) && Boolean(env.RAZORPAY_KEY_SECRET);

if (!hasRazorpayKeys) {
  console.warn("Razorpay keys are missing. Billing will not work.");
}

export const razorpay = hasRazorpayKeys
  ? new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    })
  : null;

export const PLAN_MAP = {
  STANDARD: env.RAZORPAY_STANDARD_PLAN_ID,
  PRO: env.RAZORPAY_PRO_PLAN_ID,
};

export const ensureRazorpayConfigured = () => {
  if (!razorpay) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 500;
    throw error;
  }

  return razorpay;
};

export const getPlanIdForTier = (plan) => {
  const planId = PLAN_MAP[plan];

  if (!planId) {
    const error = new Error(`No Razorpay plan configured for ${plan}`);
    error.statusCode = 500;
    throw error;
  }

  return planId;
};