import prisma from "../config/db.js";

export const getRevenueAnalyticsService = async () => {
  const users = await prisma.user.findMany({
    where: {
      plan: {
        in: ["STANDARD", "PRO"],
      },
    },
  });

  const totalUsers = users.length;

  const standardUsers = users.filter((u) => u.plan === "STANDARD").length;
  const proUsers = users.filter((u) => u.plan === "PRO").length;

  const revenue =
    standardUsers * 299 + // fallback static
    proUsers * 499;

  return {
    totalUsers,
    standardUsers,
    proUsers,
    revenue,
  };
};