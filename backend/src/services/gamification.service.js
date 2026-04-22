import prisma from "../config/db.js";

export const getMyGamificationSummaryService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      streak: true,
      solvedCount: true,
    },
  });

  const badges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
  });

  const nextMilestone =
    user?.streak && user.streak < 7
      ? 7
      : user?.streak && user.streak < 30
      ? 30
      : user?.streak && user.streak < 100
      ? 100
      : null;

  return {
    streak: user?.streak || 0,
    solvedCount: user?.solvedCount || 0,
    badges: badges.map((b) => ({
      code: b.badge.code,
      title: b.badge.title,
      description: b.badge.description,
    })),
    nextMilestone,
  };
};