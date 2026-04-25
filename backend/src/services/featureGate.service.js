export const hasPremiumAccess = (user) => {
  if (!user) return false;

  if (user.role === "ADMIN" || user.role === "CREATOR") {
    return true;
  }

  return ["STANDARD", "PRO"].includes(user.plan);
};

export const assertPremiumAccess = (user, featureName = "This feature") => {
  if (!hasPremiumAccess(user)) {
    const error = new Error(
      `${featureName} is available for creators, admins, and premium users`
    );
    error.statusCode = 403;
    throw error;
  }
};