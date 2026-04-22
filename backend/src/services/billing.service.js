import prisma from "../config/db.js";
import env from "../config/env.js";
import { razorpay } from "./razorpay.service.js";
import { getPlanPricingByTierService } from "./plan.service.js";

const getPlanFromSubscription = (subscriptionEntity) => {
  const notePlan = subscriptionEntity?.notes?.plan;
  if (notePlan === "STANDARD" || notePlan === "PRO") {
    return notePlan;
  }

  const planId = subscriptionEntity?.plan_id || "";

  if (
    env.RAZORPAY_STANDARD_PLAN_ID &&
    planId === env.RAZORPAY_STANDARD_PLAN_ID
  ) {
    return "STANDARD";
  }

  if (env.RAZORPAY_PRO_PLAN_ID && planId === env.RAZORPAY_PRO_PLAN_ID) {
    return "PRO";
  }

  return "PRO";
};

const toPeriodEndDate = (timestamp) =>
  timestamp ? new Date(timestamp * 1000) : null;

const validateRazorpayConfigForTier = (tier) => {
  if (!env.RAZORPAY_KEY_ID) {
    const error = new Error("Missing Razorpay key id");
    error.statusCode = 500;
    throw error;
  }

  if (!env.RAZORPAY_KEY_SECRET) {
    const error = new Error("Missing Razorpay key secret");
    error.statusCode = 500;
    throw error;
  }

  if (tier === "STANDARD" && !env.RAZORPAY_STANDARD_PLAN_ID) {
    const error = new Error("Missing Razorpay STANDARD plan id");
    error.statusCode = 500;
    throw error;
  }

  if (tier === "PRO" && !env.RAZORPAY_PRO_PLAN_ID) {
    const error = new Error("Missing Razorpay PRO plan id");
    error.statusCode = 500;
    throw error;
  }
};

export const createSubscriptionCheckoutService = async ({ userId, tier }) => {
  if (!["STANDARD", "PRO"].includes(tier)) {
    const error = new Error("Invalid subscription tier");
    error.statusCode = 400;
    throw error;
  }

  validateRazorpayConfigForTier(tier);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      razorpaySubscriptionId: true,
      subscriptionStatus: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== "USER") {
    const error = new Error("Pricing is available only for users");
    error.statusCode = 403;
    throw error;
  }

  const planPricing = await getPlanPricingByTierService(tier);

  const planId =
    tier === "STANDARD"
      ? env.RAZORPAY_STANDARD_PLAN_ID
      : env.RAZORPAY_PRO_PLAN_ID;

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    customer_notify: 1,
    total_count: 120,
    notes: {
      userId,
      plan: tier,
      displayAmountInPaise: String(planPricing.amountInPaise),
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
    amountInPaise: planPricing.amountInPaise,
    currency: planPricing.currency,
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