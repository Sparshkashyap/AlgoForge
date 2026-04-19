import prisma from "../config/db.js";

const BADGES = [
  {
    code: "FIRST_ACCEPTED",
    title: "First Accepted",
    description: "Earned your first accepted submission",
  },
  {
    code: "TEN_SOLVED",
    title: "10 Solved",
    description: "Solved 10 unique problems",
  },
  {
    code: "FIFTY_SOLVED",
    title: "50 Solved",
    description: "Solved 50 unique problems",
  },
  {
    code: "STREAK_3",
    title: "3 Day Streak",
    description: "Maintained a 3 day solving streak",
  },
  {
    code: "STREAK_7",
    title: "7 Day Streak",
    description: "Maintained a 7 day solving streak",
  },
  {
    code: "STREAK_30",
    title: "30 Day Streak",
    description: "Maintained a 30 day solving streak",
  },
  {
    code: "EASY_10",
    title: "Easy Explorer",
    description: "Solved 10 easy problems",
  },
  {
    code: "MEDIUM_10",
    title: "Medium Climber",
    description: "Solved 10 medium problems",
  },
  {
    code: "HARD_5",
    title: "Hard Hunter",
    description: "Solved 5 hard problems",
  },
];

export const seedBadgesService = async () => {
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {
        title: badge.title,
        description: badge.description,
      },
      create: badge,
    });
  }
};

const getSolvedDifficultyStats = async (userId) => {
  const accepted = await prisma.submission.findMany({
    where: {
      userId,
      verdict: "Accepted",
    },
    select: {
      problemId: true,
      problem: {
        select: {
          difficulty: true,
        },
      },
    },
  });

  const uniqueByProblem = new Map();

  for (const entry of accepted) {
    if (!uniqueByProblem.has(entry.problemId)) {
      uniqueByProblem.set(entry.problemId, entry.problem?.difficulty || "Unknown");
    }
  }

  let easy = 0;
  let medium = 0;
  let hard = 0;

  for (const difficulty of uniqueByProblem.values()) {
    if (difficulty === "Easy") easy += 1;
    else if (difficulty === "Medium") medium += 1;
    else if (difficulty === "Hard") hard += 1;
  }

  return {
    totalSolved: uniqueByProblem.size,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard,
  };
};

export const evaluateUserBadgesService = async (userId) => {
  const [user, difficultyStats] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        solvedCount: true,
        streak: true,
        submissions: {
          where: { verdict: "Accepted" },
          select: { id: true },
          take: 1,
        },
        userBadges: {
          include: {
            badge: true,
          },
        },
      },
    }),
    getSolvedDifficultyStats(userId),
  ]);

  if (!user) {
    return [];
  }

  const ownedCodes = new Set(user.userBadges.map((entry) => entry.badge.code));
  const desired = [];

  if (user.submissions.length > 0) desired.push("FIRST_ACCEPTED");
  if ((difficultyStats.totalSolved || 0) >= 10) desired.push("TEN_SOLVED");
  if ((difficultyStats.totalSolved || 0) >= 50) desired.push("FIFTY_SOLVED");

  if ((user.streak || 0) >= 3) desired.push("STREAK_3");
  if ((user.streak || 0) >= 7) desired.push("STREAK_7");
  if ((user.streak || 0) >= 30) desired.push("STREAK_30");

  if ((difficultyStats.easySolved || 0) >= 10) desired.push("EASY_10");
  if ((difficultyStats.mediumSolved || 0) >= 10) desired.push("MEDIUM_10");
  if ((difficultyStats.hardSolved || 0) >= 5) desired.push("HARD_5");

  const newlyAwarded = [];

  for (const code of desired) {
    if (ownedCodes.has(code)) continue;

    const badge = await prisma.badge.findUnique({
      where: { code },
    });

    if (!badge) continue;

    await prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });

    newlyAwarded.push(badge);
  }

  return newlyAwarded;
};

export const getMyBadgesService = async (userId) => {
  return prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
    orderBy: { awardedAt: "desc" },
  });
};