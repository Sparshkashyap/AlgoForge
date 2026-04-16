import prisma from "../config/db.js";

export const getAdminAnalyticsService = async () => {
  const [
    totalUsers,
    totalCreators,
    totalAdmins,
    totalProblems,
    totalSubmissions,
    premiumUsers,
    recentUsers,
    recentSubmissions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.problem.count(),
    prisma.submission.count(),
    prisma.user.count({
      where: { plan: { in: ["STANDARD", "PRO"] } },
    }),
    prisma.user.findMany({
      take: 7,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    prisma.submission.findMany({
      take: 7,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  return {
    totals: {
      totalUsers,
      totalCreators,
      totalAdmins,
      totalProblems,
      totalSubmissions,
      premiumUsers,
    },
    recentUsers,
    recentSubmissions,
  };
};

export const getCreatorAnalyticsService = async (creatorId) => {
  const [totalProblems, publishedProblems, totalSubmissions] = await Promise.all([
    prisma.problem.count({
      where: { createdById: creatorId },
    }),
    prisma.problem.count({
      where: { createdById: creatorId, isPublished: true },
    }),
    prisma.submission.count({
      where: {
        problem: {
          createdById: creatorId,
        },
      },
    }),
  ]);

  return {
    totalProblems,
    publishedProblems,
    totalSubmissions,
  };
};