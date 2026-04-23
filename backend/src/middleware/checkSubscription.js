import UserSubscription from "../models/userSubscription.model.js";

export const checkAiAccess = async (req, res, next) => {
  if (req.user.role === "ADMIN" || req.user.role === "CREATOR") {
    return next();
  }

  const sub = await UserSubscription.findOne({
    userId: req.user.id,
    isActive: true,
  }).sort({ createdAt: -1 });

  if (!sub) return res.status(403).json({ message: "Subscription required" });

  if (sub.expiresAt && sub.expiresAt < new Date()) {
    return res.status(403).json({ message: "Subscription expired" });
  }

  next();
};