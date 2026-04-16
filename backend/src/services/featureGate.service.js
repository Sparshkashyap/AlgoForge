export const hasPremiumAccess = (user) => {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return ["STANDARD", "PRO"].includes(user.plan);
};

export const assertPremiumAccess = (user, featureName = "This feature") => {
  if (!hasPremiumAccess(user)) {
    const error = new Error(`${featureName} is available only for premium users`);
    error.statusCode = 403;
    throw error;
  }
};