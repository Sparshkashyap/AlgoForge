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
    description: "Solved 10 problems",
  },
  {
    code: "STREAK_7",
    title: "7 Day Streak",
    description: "Maintained a 7 day streak",
  },
];

export const seedBadgesService = async () => {
  for (const badge of BADGES) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {},
      create: badge,
    });
  }
};

export const evaluateUserBadgesService = async (userId) => {
  const user = await prisma.user.findUnique({
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
    },
  });

  if (!user) return;

  const desired = [];

  if (user.submissions.length > 0) desired.push("FIRST_ACCEPTED");
  if ((user.solvedCount || 0) >= 10) desired.push("TEN_SOLVED");
  if ((user.streak || 0) >= 7) desired.push("STREAK_7");

  for (const code of desired) {
    const badge = await prisma.badge.findUnique({
      where: { code },
    });

    if (!badge) continue;

    await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId: badge.id,
        },
      },
      update: {},
      create: {
        userId,
        badgeId: badge.id,
      },
    });
  }
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