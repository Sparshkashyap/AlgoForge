import prisma from "../config/db.js";

export const listLearningPathsService = async () => {
  return prisma.learningPath.findMany({
    include: {
      items: {
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
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getLearningPathByIdService = async (pathId) => {
  const path = await prisma.learningPath.findUnique({
    where: { id: pathId },
    include: {
      items: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              slug: true,
              description: true,
              difficulty: true,
              tags: true,
              isPremium: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!path) {
    const error = new Error("Learning path not found");
    error.statusCode = 404;
    throw error;
  }

  return path;
};

export const createLearningPathService = async ({
  title,
  description,
  audience,
  problemIds = [],
  createdById,
}) => {
  return prisma.learningPath.create({
    data: {
      title,
      description,
      audience,
      createdById,
      items: {
        create: problemIds.map((problemId, index) => ({
          problemId,
          sortOrder: index,
        })),
      },
    },
    include: {
      items: {
        include: {
          problem: true,
        },
      },
    },
  });
};