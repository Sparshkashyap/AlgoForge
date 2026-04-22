import prisma from "../config/db.js";

const normalizeVerdict = (value) => String(value || "").trim().toLowerCase();

const formatTopTags = (map, limit = 5) =>
  [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));

const buildUserContext = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      provider: true,
      solvedCount: true,
      streak: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  const [
    recentSubmissions,
    bookmarks,
    notifications,
    notes,
    contestRegistrations,
  ] = await Promise.all([
    prisma.submission.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            tags: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.problemBookmark.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            slug: true,
            difficulty: true,
            tags: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        type: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    }),
    prisma.problemNote.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.contestRegistration.findMany({
      where: { userId },
      include: {
        contest: {
          select: {
            id: true,
            title: true,
            startAt: true,
            endAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const weakTagsMap = new Map();
  const strongTagsMap = new Map();
  const solvedProblemIds = new Set();
  const verdictCounts = new Map();

  for (const item of recentSubmissions) {
    const verdict = normalizeVerdict(item.verdict || item.status);
    verdictCounts.set(verdict, (verdictCounts.get(verdict) || 0) + 1);

    if (verdict === "accepted") {
      solvedProblemIds.add(item.problemId);
      for (const tag of item.problem?.tags || []) {
        const key = String(tag).toLowerCase();
        strongTagsMap.set(key, (strongTagsMap.get(key) || 0) + 1);
      }
    } else {
      for (const tag of item.problem?.tags || []) {
        const key = String(tag).toLowerCase();
        weakTagsMap.set(key, (weakTagsMap.get(key) || 0) + 1);
      }
    }
  }

  const recentAccepted = recentSubmissions
    .filter((item) => normalizeVerdict(item.verdict || item.status) === "accepted")
    .slice(0, 6)
    .map((item) => ({
      title: item.problem?.title,
      slug: item.problem?.slug,
      difficulty: item.problem?.difficulty,
      createdAt: item.createdAt,
    }));

  return {
    profile: user,
    summary: {
      solvedCount: user.solvedCount,
      streak: user.streak,
      solvedProblemsFromRecentSubmissions: solvedProblemIds.size,
      strongTags: formatTopTags(strongTagsMap),
      weakTags: formatTopTags(weakTagsMap),
      recentVerdictCounts: [...verdictCounts.entries()].map(([verdict, count]) => ({
        verdict,
        count,
      })),
    },
    recentAccepted,
    bookmarks: bookmarks.map((item) => ({
      title: item.problem?.title,
      slug: item.problem?.slug,
      difficulty: item.problem?.difficulty,
      tags: item.problem?.tags || [],
    })),
    recentNotifications: notifications.map((item) => ({
      type: item.type,
      title: item.title,
      message: item.message,
      isRead: item.isRead,
      createdAt: item.createdAt,
    })),
    notes: notes.map((item) => ({
      problemTitle: item.problem?.title,
      problemSlug: item.problem?.slug,
      content: item.content,
    })),
    contests: contestRegistrations.map((item) => ({
      id: item.contest?.id,
      title: item.contest?.title,
      startAt: item.contest?.startAt,
      endAt: item.contest?.endAt,
    })),
  };
};

const buildCreatorContext = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  const [createdProblems, rejectedDrafts, recentReviews] = await Promise.all([
    prisma.problem.findMany({
      where: { createdById: userId },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        tags: true,
        isPublished: true,
        reviewStatus: true,
        reviewNotes: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
    prisma.problem.findMany({
      where: {
        createdById: userId,
        reviewStatus: "REJECTED",
      },
      select: {
        title: true,
        reviewNotes: true,
        difficulty: true,
        tags: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }),
    prisma.problem.findMany({
      where: { createdById: userId },
      select: {
        title: true,
        reviewStatus: true,
        reviewNotes: true,
        isPublished: true,
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    }),
  ]);

  const tagCoverageMap = new Map();

  for (const problem of createdProblems) {
    for (const tag of problem.tags || []) {
      const key = String(tag).toLowerCase();
      tagCoverageMap.set(key, (tagCoverageMap.get(key) || 0) + 1);
    }
  }

  return {
    profile: user,
    summary: {
      totalCreatedProblems: createdProblems.length,
      publishedProblems: createdProblems.filter((p) => p.isPublished).length,
      draftProblems: createdProblems.filter((p) => !p.isPublished).length,
      rejectedProblems: createdProblems.filter((p) => p.reviewStatus === "REJECTED").length,
      tagCoverage: formatTopTags(tagCoverageMap, 8),
    },
    recentCreatedProblems: createdProblems.slice(0, 10),
    rejectedDrafts,
    recentReviews,
  };
};

const buildAdminContext = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  const [
    usersCount,
    creatorCount,
    blockedUsersCount,
    premiumUsersCount,
    problemsCount,
    draftProblemsCount,
    submissionsCount,
    contestsCount,
    pendingReviewCount,
    recentAuditLogs,
    recentNotifications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CREATOR" } }),
    prisma.user.count({ where: { isBlocked: true } }),
    prisma.user.count({ where: { plan: { in: ["STANDARD", "PRO"] } } }),
    prisma.problem.count(),
    prisma.problem.count({ where: { isPublished: false } }),
    prisma.submission.count(),
    prisma.contest.count(),
    prisma.problem.count({ where: { isPublished: false } }),
    prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        action: true,
        metadata: true,
        createdAt: true,
      },
    }),
    prisma.notification.findMany({
      where: {
        user: {
          role: "ADMIN",
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        type: true,
        title: true,
        message: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    profile: user,
    summary: {
      usersCount,
      creatorCount,
      blockedUsersCount,
      premiumUsersCount,
      problemsCount,
      draftProblemsCount,
      submissionsCount,
      contestsCount,
      pendingReviewCount,
    },
    recentAuditLogs,
    recentNotifications,
  };
};

const buildSharedPlatformContext = async () => {
  const [dailyQuestion, liveContests, topProblems] = await Promise.all([
    prisma.dailyQuestion.findFirst({
      orderBy: { activeDate: "desc" },
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
    prisma.contest.findMany({
      where: { isPublished: true },
      orderBy: { startAt: "asc" },
      take: 5,
      select: {
        id: true,
        title: true,
        startAt: true,
        endAt: true,
      },
    }),
    prisma.problem.findMany({
      where: { isPublished: true },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        title: true,
        slug: true,
        difficulty: true,
        tags: true,
      },
    }),
  ]);

  return {
    dailyQuestion: dailyQuestion
      ? {
          activeDate: dailyQuestion.activeDate,
          problem: dailyQuestion.problem,
        }
      : null,
    liveContests,
    recentProblems: topProblems,
  };
};

export const buildAiContextService = async ({ userId, role, intent }) => {
  const shared = await buildSharedPlatformContext();

  if (role === "ADMIN") {
    const adminContext = await buildAdminContext(userId);
    return {
      role,
      intent,
      shared,
      roleContext: adminContext,
    };
  }

  if (role === "CREATOR") {
    const creatorContext = await buildCreatorContext(userId);
    return {
      role,
      intent,
      shared,
      roleContext: creatorContext,
    };
  }

  const userContext = await buildUserContext(userId);
  return {
    role,
    intent,
    shared,
    roleContext: userContext,
  };
};