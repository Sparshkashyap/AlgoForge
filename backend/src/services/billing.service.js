import prisma from "../config/db.js";
import env from "../config/env.js";
import { razorpay, getPlanIdForTier } from "./razorpay.service.js";

const getPlanFromSubscription = (subscriptionEntity) => {
  const notePlan = subscriptionEntity?.notes?.plan;
  if (notePlan === "STANDARD" || notePlan === "PRO") {
    return notePlan;
  }

  const planId = subscriptionEntity?.plan_id || "";

  if (env.RAZORPAY_STANDARD_PLAN_ID && planId === env.RAZORPAY_STANDARD_PLAN_ID) {
    return "STANDARD";
  }

  if (env.RAZORPAY_PRO_PLAN_ID && planId === env.RAZORPAY_PRO_PLAN_ID) {
    return "PRO";
  }

  return "PRO";
};

const toPeriodEndDate = (timestamp) =>
  timestamp ? new Date(timestamp * 1000) : null;

export const createSubscriptionCheckoutService = async ({ userId, tier }) => {
  if (!["STANDARD", "PRO"].includes(tier)) {
    const error = new Error("Invalid subscription tier");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      razorpaySubscriptionId: true,
      subscriptionStatus: true,
    },
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
      plan: tier,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      razorpaySubscriptionId: subscription.id,
      subscriptionStatus: String(subscription.status || "created").toUpperCase(),
    },
  });

  return {
    subscriptionId: subscription.id,
    razorpayKeyId: env.RAZORPAY_KEY_ID,
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

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
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
    const error = new Error("No active subscription found");
    error.statusCode = 400;
    throw error;
  }

  const cancelled = await razorpay.subscriptions.cancel(
    user.razorpaySubscriptionId,
    {
      cancel_at_cycle_end: 1,
    }
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
      currentPeriodEnd: toPeriodEndDate(currentPeriodEnd),
    },
  });
};

export const cancelSubscriptionService = async (subscriptionId) => {
  return prisma.user.updateMany({
    where: {
      razorpaySubscriptionId: subscriptionId,
    },
    data: {
      subscriptionStatus: "CANCELLED",
      plan: "FREE",
    },
  });
};

export const processRazorpayWebhookEventService = async (payload) => {
  const eventName = payload?.event;
  const subscriptionEntity = payload?.payload?.subscription?.entity;

  if (!subscriptionEntity) {
    throw new Error("Invalid webhook payload");
  }

  switch (eventName) {
    case "subscription.activated":
    case "subscription.charged":
    case "subscription.resumed": {
      const userId = subscriptionEntity?.notes?.userId;

      if (!userId) {
        throw new Error("Missing userId in webhook notes");
      }

      return activateSubscriptionService({
        userId,
        subscriptionId: subscriptionEntity.id,
        plan: getPlanFromSubscription(subscriptionEntity),
        currentPeriodEnd: subscriptionEntity.current_end,
      });
    }

    case "subscription.cancelled":
    case "subscription.completed":
    case "subscription.halted": {
      if (!subscriptionEntity?.id) {
        throw new Error("Missing subscription id in webhook payload");
      }

      return cancelSubscriptionService(subscriptionEntity.id);
    }

    default:
      return null;
  }
};