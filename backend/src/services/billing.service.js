import prisma from "../config/db.js";
import { razorpay, getPlanIdForTier } from "./razorpay.service.js";

export const createSubscriptionCheckoutService = async ({
  userId,
  tier,
}) => {
  if (!["STANDARD", "PRO"].includes(tier)) {
    const error = new Error("Invalid subscription tier");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const planId = getPlanIdForTier(tier);

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 120,
    notes: {
      userId,
      tier,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      razorpaySubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
    },
  });

  return {
    subscriptionId: subscription.id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    plan: tier,
    user: {
      name: user.name,
      email: user.email,
    },
  };
};

export const getMyBillingService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      subscriptionStatus: true,
      razorpaySubscriptionId: true,
      currentPeriodEnd: true,
    },
  });

  return user;
};

export const cancelMySubscriptionService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.razorpaySubscriptionId) {
    const error = new Error("No active subscription found");
    error.statusCode = 400;
    throw error;
  }

  const cancelled = await razorpay.subscriptions.cancel(
    user.razorpaySubscriptionId,
    { cancel_at_cycle_end: 1 }
  );

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: cancelled.status,
    },
  });

  return cancelled;
};

export const applySubscriptionEventService = async ({
  subscriptionId,
  status,
  plan,
  currentEndAt,
}) => {
  const user = await prisma.user.findFirst({
    where: { razorpaySubscriptionId: subscriptionId },
  });

  if (!user) return null;

  const nextPlan =
    status === "active" || status === "authenticated"
      ? plan
      : status === "cancelled"
      ? "FREE"
      : user.plan;

  return prisma.user.update({
    where: { id: user.id },
    data: {
      plan: nextPlan,
      subscriptionStatus: status,
      currentPeriodEnd: currentEndAt ? new Date(currentEndAt * 1000) : user.currentPeriodEnd,
    },
  });
};