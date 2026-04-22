import prisma from "../config/db.js";

const difficultyWeight = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

export const getGlobalLeaderboardService = async () => {
  const acceptedSubmissions = await prisma.submission.findMany({
    where: {
      OR: [
        { verdict: "Accepted" },
        { verdict: "ACCEPTED" },
        { status: "ACCEPTED" },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          role: true,
        },
      },
      problem: {
        select: {
          id: true,
          difficulty: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const leaderboardMap = new Map();
  const solvedPairs = new Set();

  for (const submission of acceptedSubmissions) {
    if (!submission.user || submission.user.role !== "USER") continue;
    if (!submission.userId || !submission.problemId) continue;

    const solvedKey = `${submission.userId}:${submission.problemId}`;
    if (solvedPairs.has(solvedKey)) continue;
    solvedPairs.add(solvedKey);

    if (!leaderboardMap.has(submission.userId)) {
      leaderboardMap.set(submission.userId, {
        id: submission.user.id,
        userId: submission.user.id,
        name: submission.user.name,
        avatarUrl: submission.user.avatarUrl || null,
        solvedCount: 0,
        score: 0,
      });
    }

    const entry = leaderboardMap.get(submission.userId);
    const difficulty = String(submission.problem?.difficulty || "EASY").toUpperCase();

    entry.solvedCount += 1;
    entry.score += difficultyWeight[difficulty] || 1;
  }

  return Array.from(leaderboardMap.values())
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;
      return (a.name || "").localeCompare(b.name || "");
    })
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
};