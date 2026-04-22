import prisma from "../config/db.js";

export const listMyBookmarksService = async (userId) => {
  return prisma.problemBookmark.findMany({
    where: { userId },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          slug: true,
          difficulty: true,
          tags: true,
          isPremium: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const toggleBookmarkService = async ({ userId, problemId }) => {
  const existing = await prisma.problemBookmark.findUnique({
    where: {
      userId_problemId: {
        userId,
        problemId,
      },
    },
  });

  if (existing) {
    await prisma.problemBookmark.delete({
      where: {
        userId_problemId: {
          userId,
          problemId,
        },
      },
    });

    return { bookmarked: false };
  }

  await prisma.problemBookmark.create({
    data: {
      userId,
      problemId,
    },
  });

  return { bookmarked: true };
};