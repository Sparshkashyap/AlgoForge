import prisma from "../config/db.js";

const difficultyScore = {
  EASY: 100,
  MEDIUM: 200,
  HARD: 300,
};

const getProblemScore = (difficulty = "EASY") => {
  return difficultyScore[String(difficulty).toUpperCase()] || 100;
};

export const getContestRankingService = async (contestId) => {
  const contest = await prisma.contest.findUnique({
    where: { id: contestId },
    include: {
      problems: {
        include: {
          problem: {
            select: {
              id: true,
              title: true,
              difficulty: true,
              slug: true,
            },
          },
        },
      },
      registrations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!contest) {
    const error = new Error("Contest not found");
    error.statusCode = 404;
    throw error;
  }

  const contestProblemIds = contest.problems.map((item) => item.problemId);
  const registeredUserIds = contest.registrations.map((item) => item.userId);

  if (!contestProblemIds.length || !registeredUserIds.length) {
    return {
      contest: {
        id: contest.id,
        title: contest.title,
        startAt: contest.startAt,
        endAt: contest.endAt,
      },
      summary: {
        participants: registeredUserIds.length,
        totalSubmissions: 0,
        acceptedSubmissions: 0,
      },
      rows: contest.registrations.map((registration, index) => ({
        rank: index + 1,
        userId: registration.userId,
        name: registration.user?.name || "Unknown User",
        email: registration.user?.email || "",
        avatarUrl: registration.user?.avatarUrl || null,
        solved: 0,
        score: 0,
        attempts: 0,
        penalty: 0,
        lastAcceptedAt: null,
        solvedProblems: [],
      })),
    };
  }

  const submissions = await prisma.submission.findMany({
    where: {
      userId: {
        in: registeredUserIds,
      },
      problemId: {
        in: contestProblemIds,
      },
      createdAt: {
        gte: contest.startAt,
        lte: contest.endAt,
      },
    },
    include: {
      problem: {
        select: {
          id: true,
          title: true,
          difficulty: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const rowsMap = new Map();

  for (const registration of contest.registrations) {
    rowsMap.set(registration.userId, {
      rank: 0,
      userId: registration.userId,
      name: registration.user?.name || "Unknown User",
      email: registration.user?.email || "",
      avatarUrl: registration.user?.avatarUrl || null,
      solved: 0,
      score: 0,
      attempts: 0,
      penalty: 0,
      lastAcceptedAt: null,
      solvedProblems: [],
      _solvedSet: new Set(),
      _wrongAttemptsBeforeAccept: new Map(),
    });
  }

  let acceptedSubmissions = 0;

  for (const submission of submissions) {
    const row = rowsMap.get(submission.userId);
    if (!row) continue;

    row.attempts += 1;

    const problemId = submission.problemId;
    const alreadySolved = row._solvedSet.has(problemId);
    const verdict = String(submission.verdict || "").toLowerCase();
    const isAccepted = verdict === "accepted";

    if (alreadySolved) {
      continue;
    }

    if (!isAccepted) {
      row._wrongAttemptsBeforeAccept.set(
        problemId,
        (row._wrongAttemptsBeforeAccept.get(problemId) || 0) + 1
      );
      continue;
    }

    acceptedSubmissions += 1;

    const problemScore = getProblemScore(submission.problem?.difficulty);
    const wrongAttempts = row._wrongAttemptsBeforeAccept.get(problemId) || 0;

    const acceptedAt = new Date(submission.createdAt);
    const minutesFromStart = Math.max(
      0,
      Math.floor((acceptedAt.getTime() - new Date(contest.startAt).getTime()) / 60000)
    );

    const penalty = minutesFromStart + wrongAttempts * 20;

    row._solvedSet.add(problemId);
    row.solved += 1;
    row.score += problemScore;
    row.penalty += penalty;
    row.lastAcceptedAt = acceptedAt;

    row.solvedProblems.push({
      problemId,
      title: submission.problem?.title || "Unknown Problem",
      slug: submission.problem?.slug || "",
      difficulty: submission.problem?.difficulty || "EASY",
      score: problemScore,
      wrongAttempts,
      acceptedAt,
      penalty,
    });
  }

  const rows = [...rowsMap.values()]
    .map((row) => {
      delete row._solvedSet;
      delete row._wrongAttemptsBeforeAccept;
      return row;
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.penalty !== b.penalty) return a.penalty - b.penalty;
      if (b.solved !== a.solved) return b.solved - a.solved;

      const aTime = a.lastAcceptedAt ? new Date(a.lastAcceptedAt).getTime() : Infinity;
      const bTime = b.lastAcceptedAt ? new Date(b.lastAcceptedAt).getTime() : Infinity;

      return aTime - bTime;
    })
    .map((row, index) => ({
      ...row,
      rank: index + 1,
    }));

  return {
    contest: {
      id: contest.id,
      title: contest.title,
      startAt: contest.startAt,
      endAt: contest.endAt,
    },
    summary: {
      participants: registeredUserIds.length,
      totalSubmissions: submissions.length,
      acceptedSubmissions,
    },
    rows,
  };
};