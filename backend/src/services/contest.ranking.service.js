import prisma from "../config/db.js";

const difficultyWeight = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
};

export const getContestRankingService = async (contestId) => {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: {
      problems: {
        include: {
          problem: true,
        },
      },
      registrations: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!contest) {
    const error = new Error("Contest not found");
    error.statusCode = 404;
    throw error;
  }

  const contestProblemIds = contest.problems.map((p) => p.problemId);

  const acceptedSubmissions = await prisma.submission.findMany({
    where: {
      problemId: { in: contestProblemIds },
      verdict: "Accepted",
      userId: { in: contest.registrations.map((r) => r.userId) },
    },
    include: {
      problem: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const map = new Map();

  for (const reg of contest.registrations) {
    map.set(reg.userId, {
      userId: reg.userId,
      name: reg.user.name,
      solved: 0,
      score: 0,
    });
  }

  const seen = new Set();

  for (const sub of acceptedSubmissions) {
    const key = `${sub.userId}:${sub.problemId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const row = map.get(sub.userId);
    if (!row) continue;

    row.solved += 1;
    row.score += difficultyWeight[sub.problem?.difficulty || "EASY"] || 1;
  }

  return [...map.values()].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.solved - a.solved;
  });
};