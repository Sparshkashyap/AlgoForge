import prisma from "../config/db.js";

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const formatDayKey = (date) => {
  return startOfDay(date).toISOString().slice(0, 10);
};

export const getAdminAnalyticsService = async () => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalCreators,
    totalAdmins,
    totalProblems,
    totalPublishedProblems,
    totalSubmissions,
    acceptedSubmissions,
    blockedUsers,
    premiumUsers,
    recentUsers,
    recentSubmissions,
    publishedProblemsByDifficulty,
    solvedUniqueAccepted,
    dailyQuestionsCount,
    contestCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.problem.count(),
    prisma.problem.count({ where: { isPublished: true } }),
    prisma.submission.count(),
    prisma.submission.count({ where: { verdict: "Accepted" } }),
    prisma.user.count({ where: { isBlocked: true } }),
    prisma.user.count({ where: { plan: { in: ["STANDARD", "PRO"] } } }),
    prisma.user.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
      },
    }),
    prisma.submission.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
        verdict: true,
      },
    }),
    prisma.problem.findMany({
      where: { isPublished: true },
      select: {
        difficulty: true,
      },
    }),
    prisma.submission.findMany({
      where: { verdict: "Accepted" },
      select: {
        userId: true,
        problemId: true,
        problem: {
          select: {
            difficulty: true,
          },
        },
      },
    }),
    prisma.dailyQuestion.count(),
    prisma.contest.count(),
  ]);

  const userGrowthMap = new Map();
  const submissionTrendMap = new Map();

  for (let i = 0; i < 30; i += 1) {
    const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const key = formatDayKey(date);
    userGrowthMap.set(key, 0);
    submissionTrendMap.set(key, {
      total: 0,
      accepted: 0,
    });
  }

  for (const user of recentUsers) {
    const key = formatDayKey(user.createdAt);
    userGrowthMap.set(key, (userGrowthMap.get(key) || 0) + 1);
  }

  for (const submission of recentSubmissions) {
    const key = formatDayKey(submission.createdAt);
    const existing = submissionTrendMap.get(key) || { total: 0, accepted: 0 };
    existing.total += 1;
    if (submission.verdict === "Accepted") {
      existing.accepted += 1;
    }
    submissionTrendMap.set(key, existing);
  }

  let publishedEasy = 0;
  let publishedMedium = 0;
  let publishedHard = 0;

  for (const problem of publishedProblemsByDifficulty) {
    if (problem.difficulty === "Easy") publishedEasy += 1;
    else if (problem.difficulty === "Medium") publishedMedium += 1;
    else if (problem.difficulty === "Hard") publishedHard += 1;
  }

  const uniqueSolved = new Map();

  for (const entry of solvedUniqueAccepted) {
    const key = `${entry.userId}:${entry.problemId}`;
    if (!uniqueSolved.has(key)) {
      uniqueSolved.set(key, entry.problem?.difficulty || "Unknown");
    }
  }

  let solvedEasy = 0;
  let solvedMedium = 0;
  let solvedHard = 0;

  for (const difficulty of uniqueSolved.values()) {
    if (difficulty === "Easy") solvedEasy += 1;
    else if (difficulty === "Medium") solvedMedium += 1;
    else if (difficulty === "Hard") solvedHard += 1;
  }

  const activeUsers7d = await prisma.submission.groupBy({
    by: ["userId"],
    where: {
      createdAt: {
        gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    },
  });

  return {
    overview: {
      totalUsers,
      totalCreators,
      totalAdmins,
      blockedUsers,
      premiumUsers,
      totalProblems,
      totalPublishedProblems,
      totalSubmissions,
      acceptedSubmissions,
      dailyQuestionsCount,
      contestCount,
      activeUsers7d: activeUsers7d.length,
    },
    userGrowth30d: Array.from(userGrowthMap.entries()).map(([date, count]) => ({
      date,
      count,
    })),
    submissionTrend30d: Array.from(submissionTrendMap.entries()).map(
      ([date, counts]) => ({
        date,
        total: counts.total,
        accepted: counts.accepted,
      })
    ),
    publishedProblemDifficultyMix: {
      easy: publishedEasy,
      medium: publishedMedium,
      hard: publishedHard,
    },
    solvedDifficultyMix: {
      easy: solvedEasy,
      medium: solvedMedium,
      hard: solvedHard,
    },
  };
};