import prisma from "../config/db.js";

const normalizeTags = (items = []) =>
  items.map((item) => String(item).trim().toLowerCase()).filter(Boolean);

const extractKeywords = (message = "") => {
  return String(message)
    .toLowerCase()
    .replace(/[^a-z0-9+\s-]/g, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 3);
};

const uniqueBy = (items, keyFn) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const searchProblems = async (message, limit = 8) => {
  const keywords = extractKeywords(message);

  if (!keywords.length) {
    const items = await prisma.problem.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        tags: true,
        isPremium: true,
      },
    });

    return items.map((item) => ({
      type: "problem",
      content: {
        title: item.title,
        slug: item.slug,
        difficulty: item.difficulty,
        tags: item.tags,
        isPremium: item.isPremium,
      },
    }));
  }

  const items = await prisma.problem.findMany({
    where: {
      isPublished: true,
      OR: [
        ...keywords.map((word) => ({
          title: {
            contains: word,
            mode: "insensitive",
          },
        })),
      ],
    },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      tags: true,
      isPremium: true,
    },
  });

  return items.map((item) => ({
    type: "problem",
    content: {
      title: item.title,
      slug: item.slug,
      difficulty: item.difficulty,
      tags: item.tags,
      isPremium: item.isPremium,
    },
  }));
};

const searchDiscussions = async (message, limit = 6) => {
  const keywords = extractKeywords(message);
  if (!keywords.length) return [];

  const discussions = await prisma.problemDiscussion.findMany({
    where: {
      OR: keywords.map((word) => ({
        content: {
          contains: word,
          mode: "insensitive",
        },
      })),
    },
    include: {
      problem: {
        select: {
          title: true,
          slug: true,
          difficulty: true,
        },
      },
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return discussions.map((item) => ({
    type: "discussion",
    content: {
      problemTitle: item.problem?.title,
      problemSlug: item.problem?.slug,
      difficulty: item.problem?.difficulty,
      author: item.user?.name,
      text: item.content,
    },
  }));
};

const searchLearningPaths = async (message, limit = 5) => {
  const keywords = extractKeywords(message);
  if (!keywords.length) return [];

  const paths = await prisma.learningPath.findMany({
    where: {
      OR: keywords.map((word) => ({
        title: {
          contains: word,
          mode: "insensitive",
        },
      })),
    },
    include: {
      items: {
        include: {
          problem: {
            select: {
              title: true,
              slug: true,
              difficulty: true,
            },
          },
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 5,
      },
    },
    take: limit,
  });

  return paths.map((item) => ({
    type: "learning_path",
    content: {
      title: item.title,
      description: item.description,
      audience: item.audience,
      items: item.items.map((entry) => ({
        title: entry.problem?.title,
        slug: entry.problem?.slug,
        difficulty: entry.problem?.difficulty,
      })),
    },
  }));
};

export const retrieveAiContextChunksService = async ({
  message,
  role,
  intent,
}) => {
  const [problems, discussions, paths] = await Promise.all([
    searchProblems(message, 8),
    searchDiscussions(message, role === "ADMIN" ? 3 : 6),
    searchLearningPaths(message, 4),
  ]);

  const all = uniqueBy([...problems, ...discussions, ...paths], (item) =>
    JSON.stringify(item.content)
  );

  return {
    intent,
    role,
    chunks: all.slice(0, 12),
  };
};