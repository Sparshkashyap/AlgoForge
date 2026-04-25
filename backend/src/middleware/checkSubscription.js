import prisma from "../config/db.js";

const isPaidPlan = (plan) => plan === "STANDARD" || plan === "PRO";

const hasActiveAccess = (user) => {
  if (!user) return false;

  const plan = user.plan || "FREE";
  const subscriptionStatus = String(user.subscriptionStatus || "").toUpperCase();
  const currentPeriodEnd = user.currentPeriodEnd
    ? new Date(user.currentPeriodEnd).getTime()
    : null;

  if (!isPaidPlan(plan)) {
    return false;
  }

  if (subscriptionStatus === "ACTIVE") {
    return true;
  }

  if (currentPeriodEnd && currentPeriodEnd > Date.now()) {
    return true;
  }

  return false;
};

export const checkAiAccess = async (req, res, next) => {
  try {
    if (!req.user?.userId && !req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const authUserId = req.user.userId || req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: authUserId },
      select: {
        id: true,
        role: true,
        plan: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "ADMIN" || user.role === "CREATOR") {
      return next();
    }

    if (!hasActiveAccess(user)) {
      return res.status(403).json({
        success: false,
        message: "Subscription required",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to verify AI access",
    });
  }
};