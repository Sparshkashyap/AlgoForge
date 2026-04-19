import prisma from "../config/db.js";
import { razorpay, getPlanIdForTier } from "./razorpay.service.js";

const getPlan = (sub) => {
  const note = sub?.notes?.plan;
  if (["STANDARD", "PRO"].includes(note)) return note;

  const id = sub?.plan_id;
  if (id === process.env.RAZORPAY_STANDARD_PLAN_ID) return "STANDARD";
  if (id === process.env.RAZORPAY_PRO_PLAN_ID) return "PRO";

  return "PRO";
};

const toDate = (ts) => (ts ? new Date(ts * 1000) : null);

export const createSubscriptionCheckoutService = async ({
  userId,
  tier,
}) => {
  if (!["STANDARD", "PRO"].includes(tier)) {
    const err = new Error("Invalid subscription tier");
    err.statusCode = 400;
    throw err;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const planId = getPlanIdForTier(tier);

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 120,
    notes: {
      userId,
      plan: tier,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      razorpaySubscriptionId: subscription.id,
      subscriptionStatus: String(subscription.status || "").toUpperCase(),
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
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      subscriptionStatus: true,
      razorpaySubscriptionId: true,
      currentPeriodEnd: true,
    },
  });
};

export const cancelMySubscriptionService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      razorpaySubscriptionId: true,
    },
  });

  if (!user?.razorpaySubscriptionId) {
    const err = new Error("No active subscription found");
    err.statusCode = 400;
    throw err;
  }

  const cancelled = await razorpay.subscriptions.cancel(
    user.razorpaySubscriptionId,
    { cancel_at_cycle_end: 1 }
  );

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: String(cancelled.status || "cancelled").toUpperCase(),
    },
  });

  return cancelled;
};

export const activateSubscriptionService = async ({
  userId,
  subscriptionId,
  plan,
  currentPeriodEnd,
}) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      razorpaySubscriptionId: subscriptionId,
      subscriptionStatus: "ACTIVE",
      currentPeriodEnd: toDate(currentPeriodEnd),
    },
  });
};

export const cancelSubscriptionService = async (subscriptionId) => {
  return prisma.user.updateMany({
    where: { razorpaySubscriptionId: subscriptionId },
    data: {
      subscriptionStatus: "CANCELLED",
      plan: "FREE",
    },
  });
};

export const processRazorpayWebhookEventService = async (payload) => {
  const event = payload.event;
  const sub = payload?.payload?.subscription?.entity;

  if (!sub) {
    throw new Error("Invalid webhook payload");
  }

  switch (event) {
    case "subscription.activated":
    case "subscription.charged":
    case "subscription.resumed": {
      const userId = sub?.notes?.userId;
      if (!userId) {
        throw new Error("Missing userId in notes");
      }

      return activateSubscriptionService({
        userId,
        subscriptionId: sub.id,
        plan: getPlan(sub),
        currentPeriodEnd: sub.current_end,
      });
    }

    case "subscription.cancelled":
    case "subscription.completed":
    case "subscription.halted": {
      if (!sub.id) {
        throw new Error("Missing subscription id");
      }

      return cancelSubscriptionService(sub.id);
    }

    default:
      return null;
  }
};