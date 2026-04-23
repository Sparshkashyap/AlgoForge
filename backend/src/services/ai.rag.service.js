import prisma from "../config/db.js";

const STOP_WORDS = new Set([
  "the",
  "is",
  "am",
  "are",
  "a",
  "an",
  "and",
  "or",
  "of",
  "to",
  "in",
  "on",
  "for",
  "with",
  "me",
  "my",
  "i",
  "you",
  "what",
  "how",
  "why",
  "give",
  "tell",
  "please",
  "about",
  "from",
  "that",
  "this",
  "your",
  "mera",
  "meri",
  "mere",
  "mujhe",
  "kya",
  "kaise",
  "karu",
  "karna",
  "hain",
  "hai",
  "aur",
  "ke",
  "ki",
  "ko",
  "ka",
]);

const normalizeText = (value = "") =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value = "") =>
  normalizeText(value)
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item.length >= 2 && !STOP_WORDS.has(item));

const scoreText = (queryTokens, content) => {
  const hay = normalizeText(content);
  let score = 0;

  for (const token of queryTokens) {
    if (!token) continue;

    if (hay.includes(` ${token} `) || hay.startsWith(`${token} `) || hay.endsWith(` ${token}`)) {
      score += 4;
    } else if (hay.includes(token)) {
      score += 2;
    }
  }

  return score;
};

const uniqueById = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const buildProblemChunks = (problems, queryTokens) =>
  problems
    .map((problem) => {
      const score =
        scoreText(
          queryTokens,
          `${problem.title} ${problem.description} ${problem.difficulty} ${(problem.tags || []).join(" ")}`
        ) + (problem.isPublished ? 2 : 0);

      return {
        id: `problem-${problem.id}`,
        type: "problem",
        title: problem.title,
        subtitle: `${problem.difficulty} • ${(problem.tags || []).slice(0, 3).join(", ") || "problem"}`,
        href: `/problems/${problem.slug}`,
        score,
        content:
          `${problem.title}\nDifficulty: ${problem.difficulty}\nTags: ${(problem.tags || []).join(", ")}\n` +
          `${problem.description || ""}\n${problem.constraints || ""}\n${problem.explanation || ""}`,
      };
    })
    .filter((item) => item.score > 0);

const buildDiscussionChunks = (items, queryTokens) =>
  items
    .map((item) => {
      const score =
        scoreText(queryTokens, `${item.content} ${item.problem?.title || ""} ${item.problem?.difficulty || ""}`) + 2;

      return {
        id: `discussion-${item.id}`,
        type: "discussion",
        title: item.problem?.title || "Problem discussion",
        subtitle: `Discussion • ${item.user?.name || "user"}`,
        href: item.problem?.slug ? `/problems/${item.problem.slug}` : undefined,
        score,
        content: `${item.problem?.title || ""}\n${item.content}\n${item.user?.name || ""}`,
      };
    })
    .filter((item) => item.score > 0);

const buildPathChunks = (paths, queryTokens) =>
  paths
    .map((path) => {
      const itemText = (path.items || [])
        .map((entry) => `${entry.problem?.title || ""} ${entry.problem?.difficulty || ""}`)
        .join(" ");

      const score =
        scoreText(
          queryTokens,
          `${path.title} ${path.description || ""} ${path.audience || ""} ${itemText}`
        ) + 1;

      return {
        id: `learning-path-${path.id}`,
        type: "learning_path",
        title: path.title,
        subtitle: `Learning path • ${path.audience || "general"}`,
        href: "/roadmap",
        score,
        content:
          `${path.title}\n${path.description || ""}\nAudience: ${path.audience || ""}\n` +
          `${(path.items || [])
            .map((entry) => entry.problem?.title)
            .filter(Boolean)
            .join(", ")}`,
      };
    })
    .filter((item) => item.score > 0);

const buildNoteChunks = (notes, queryTokens) =>
  notes
    .map((note) => {
      const score =
        scoreText(queryTokens, `${note.content} ${note.problem?.title || ""} ${note.problem?.difficulty || ""}`) + 2;

      return {
        id: `note-${note.id}`,
        type: "note",
        title: note.problem?.title || "Saved note",
        subtitle: "Your note",
        href: note.problem?.slug ? `/problems/${note.problem.slug}` : "/bookmarks",
        score,
        content: `${note.problem?.title || ""}\n${note.content}`,
      };
    })
    .filter((item) => item.score > 0);

const buildBookmarkChunks = (items, queryTokens) =>
  items
    .map((item) => {
      const score =
        scoreText(
          queryTokens,
          `${item.problem?.title || ""} ${item.problem?.difficulty || ""} ${(item.problem?.tags || []).join(" ")}`
        ) + 1;

      return {
        id: `bookmark-${item.id}`,
        type: "bookmark",
        title: item.problem?.title || "Bookmarked problem",
        subtitle: `Bookmark • ${item.problem?.difficulty || "problem"}`,
        href: item.problem?.slug ? `/problems/${item.problem.slug}` : "/bookmarks",
        score,
        content:
          `${item.problem?.title || ""}\n${item.problem?.difficulty || ""}\n` +
          `${(item.problem?.tags || []).join(", ")}`,
      };
    })
    .filter((item) => item.score > 0);

const buildContestChunks = (contests, queryTokens) =>
  contests
    .map((contest) => {
      const score =
        scoreText(queryTokens, `${contest.title} ${contest.description || ""}`) + 1;

      return {
        id: `contest-${contest.id}`,
        type: "contest",
        title: contest.title,
        subtitle: "Contest",
        href: `/contests/${contest.id}`,
        score,
        content: `${contest.title}\n${contest.description || ""}`,
      };
    })
    .filter((item) => item.score > 0);

const buildNotificationChunks = (items, queryTokens) =>
  items
    .map((item) => {
      const score =
        scoreText(queryTokens, `${item.title} ${item.message} ${item.type}`) + 1;

      return {
        id: `notification-${item.id}`,
        type: "notification",
        title: item.title,
        subtitle: "Notification",
        href: "/notifications",
        score,
        content: `${item.title}\n${item.message}`,
      };
    })
    .filter((item) => item.score > 0);

const buildCreatorProblemChunks = (items, queryTokens) =>
  items
    .map((problem) => {
      const score =
        scoreText(
          queryTokens,
          `${problem.title} ${problem.description || ""} ${problem.reviewStatus || ""} ${problem.reviewNotes || ""} ${(problem.tags || []).join(" ")}`
        ) + 3;

      return {
        id: `creator-problem-${problem.id}`,
        type: "creator_problem",
        title: problem.title,
        subtitle: `${problem.reviewStatus || (problem.isPublished ? "PUBLISHED" : "DRAFT")} • creator problem`,
        href: problem.id ? `/create-problem/${problem.id}` : "/manage-problems",
        score,
        content:
          `${problem.title}\nReview status: ${problem.reviewStatus || "N/A"}\n` +
          `${problem.reviewNotes || ""}\n${problem.description || ""}`,
      };
    })
    .filter((item) => item.score > 0);

const buildAdminAuditChunks = (items, queryTokens) =>
  items
    .map((item) => {
      const metadata =
        typeof item.metadata === "object" && item.metadata !== null
          ? JSON.stringify(item.metadata)
          : String(item.metadata || "");

      const score = scoreText(queryTokens, `${item.action} ${metadata}`) + 2;

      return {
        id: `audit-${item.id}`,
        type: "audit_log",
        title: item.action,
        subtitle: "Audit log",
        href: "/admin-audit-logs",
        score,
        content: `${item.action}\n${metadata}`,
      };
    })
    .filter((item) => item.score > 0);

const buildAdminReviewQueueChunks = (items, queryTokens) =>
  items
    .map((problem) => {
      const score =
        scoreText(
          queryTokens,
          `${problem.title} ${problem.reviewStatus || ""} ${problem.reviewNotes || ""} ${(problem.tags || []).join(" ")}`
        ) + 3;

      return {
        id: `review-queue-${problem.id}`,
        type: "review_queue",
        title: problem.title,
        subtitle: `${problem.reviewStatus || "PENDING"} • review queue`,
        href: "/admin-problem-review",
        score,
        content:
          `${problem.title}\nReview status: ${problem.reviewStatus || "PENDING"}\n` +
          `${problem.reviewNotes || ""}`,
      };
    })
    .filter((item) => item.score > 0);

const fetchSharedRetrievalData = async () => {
  const [problems, discussions, paths, contests] = await Promise.all([
    prisma.problem.findMany({
      where: { isPublished: true },
      take: 18,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        difficulty: true,
        tags: true,
        constraints: true,
        explanation: true,
        isPublished: true,
      },
    }),
    prisma.problemDiscussion.findMany({
      take: 14,
      orderBy: { updatedAt: "desc" },
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
    }),
    prisma.learningPath.findMany({
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: {
        items: {
          orderBy: { sortOrder: "asc" },
          take: 6,
          include: {
            problem: {
              select: {
                title: true,
                difficulty: true,
              },
            },
          },
        },
      },
    }),
    prisma.contest.findMany({
      where: { isPublished: true },
      take: 8,
      orderBy: { startAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
      },
    }),
  ]);

  return { problems, discussions, paths, contests };
};

const fetchUserRetrievalData = async (userId) => {
  const [notes, bookmarks, notifications] = await Promise.all([
    prisma.problemNote.findMany({
      where: { userId },
      take: 10,
      orderBy: { updatedAt: "desc" },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    }),
    prisma.problemBookmark.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
            tags: true,
          },
        },
      },
    }),
    prisma.notification.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        title: true,
        message: true,
      },
    }),
  ]);

  return { notes, bookmarks, notifications };
};

const fetchCreatorRetrievalData = async (userId) => {
  const problems = await prisma.problem.findMany({
    where: { createdById: userId },
    take: 16,
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      tags: true,
      reviewStatus: true,
      reviewNotes: true,
      isPublished: true,
    },
  });

  return { problems };
};

const fetchAdminRetrievalData = async () => {
  const [auditLogs, reviewQueue] = await Promise.all([
    prisma.auditLog.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        action: true,
        metadata: true,
      },
    }),
    prisma.problem.findMany({
      where: {
        OR: [
          { isPublished: false },
          { reviewStatus: { not: null } },
        ],
      },
      take: 14,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        reviewStatus: true,
        reviewNotes: true,
        tags: true,
      },
    }),
  ]);

  return { auditLogs, reviewQueue };
};

export const retrieveAiContextChunksService = async ({
  message,
  userId,
  role,
  intent,
}) => {
  const queryTokens = tokenize(`${message} ${intent}`);

  const shared = await fetchSharedRetrievalData();

  const sharedChunks = [
    ...buildProblemChunks(shared.problems, queryTokens),
    ...buildDiscussionChunks(shared.discussions, queryTokens),
    ...buildPathChunks(shared.paths, queryTokens),
    ...buildContestChunks(shared.contests, queryTokens),
  ];

  let roleSpecificChunks = [];

  if (role === "USER") {
    const userData = await fetchUserRetrievalData(userId);
    roleSpecificChunks = [
      ...buildNoteChunks(userData.notes, queryTokens),
      ...buildBookmarkChunks(userData.bookmarks, queryTokens),
      ...buildNotificationChunks(userData.notifications, queryTokens),
    ];
  }

  if (role === "CREATOR") {
    const creatorData = await fetchCreatorRetrievalData(userId);
    roleSpecificChunks = [
      ...buildCreatorProblemChunks(creatorData.problems, queryTokens),
    ];
  }

  if (role === "ADMIN") {
    const adminData = await fetchAdminRetrievalData();
    roleSpecificChunks = [
      ...buildAdminAuditChunks(adminData.auditLogs, queryTokens),
      ...buildAdminReviewQueueChunks(adminData.reviewQueue, queryTokens),
    ];
  }

  const ranked = uniqueById([...roleSpecificChunks, ...sharedChunks])
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  return {
    intent,
    role,
    chunks: ranked,
  };
};