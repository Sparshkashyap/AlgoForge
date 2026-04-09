import Razorpay from "razorpay";
import env from "../config/env.js";

const razorpay =
  env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET
    ? new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET
      })
    : null;

export const createOrderService = async ({ amount, currency = "INR", receipt }) => {
  if (!razorpay) {
    const error = new Error("Razorpay is not configured");
    error.statusCode = 500;
    throw error;
  }

  return razorpay.orders.create({
    amount,
    currency,
    receipt
  });
};