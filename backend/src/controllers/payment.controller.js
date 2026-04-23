import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/subscription.model.js";
import UserSubscription from "../models/userSubscription.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createOrder = async (req, res) => {
  const { planId } = req.body;
  const plan = await Subscription.findById(planId);

  const order = await razorpay.orders.create({
    amount: plan.price * 100,
    currency: "INR",
  });

  res.json({ order, plan });
};

export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (sign !== razorpay_signature) {
    return res.status(400).json({ error: "Payment failed" });
  }

  const plan = await Subscription.findById(planId);

  let expiry = null;
  if (plan.durationDays > 0) {
    expiry = new Date();
    expiry.setDate(expiry.getDate() + plan.durationDays);
  }

  await UserSubscription.create({
    userId: req.user.id,
    subscriptionId: plan._id,
    expiresAt: expiry,
  });

  res.json({ success: true });
};