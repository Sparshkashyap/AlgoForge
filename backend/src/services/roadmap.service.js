import prisma from "../config/db.js";

const normalizeDifficulty = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "easy") return "Easy";
  if (v === "medium") return "Medium";
  if (v === "hard") return "Hard";
  return "Unknown";
};

const normalizeVerdict = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "accepted") return "Accepted";
  if (v === "wrong answer") return "Wrong Answer";
  if (v === "runtime error") return "Runtime Error";
  if (v === "compilation error") return "Compilation Error";
  return "Unknown";
};

const pickTopTags = (map, count = 6) => {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([tag, value]) => ({ tag, value }));
};

export const getRoadmapService = async (userId) => {
  const problems = await prisma.problem.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      tags: true,
      isPremium: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const submissions = userId
    ? await prisma.submission.findMany({
        where: { userId },
        select: {
          problemId: true,
          verdict: true,
          status: true,
          createdAt: true,
          problem: {
            select: {
              difficulty: true,
              tags: true,
            },
          },
        },
      })
    : [];

  const acceptedProblemIds = new Set();
  const attemptedProblemIds = new Set();

  const solvedTagMap = new Map();
  const weakTagMap = new Map();
  const solvedDifficultyMap = new Map([
    ["Easy", 0],
    ["Medium", 0],
    ["Hard", 0],
  ]);

  for (const sub of submissions) {
    attemptedProblemIds.add(sub.problemId);

    const verdict = normalizeVerdict(sub.verdict || sub.status);
    const difficulty = normalizeDifficulty(sub.problem?.difficulty);

    if (verdict === "Accepted") {
      acceptedProblemIds.add(sub.problemId);
      solvedDifficultyMap.set(
        difficulty,
        (solvedDifficultyMap.get(difficulty) || 0) + 1
      );

      for (const tag of sub.problem?.tags || []) {
        const key = String(tag).trim().toLowerCase();
        if (!key) continue;
        solvedTagMap.set(key, (solvedTagMap.get(key) || 0) + 1);
      }
    } else {
      for (const tag of sub.problem?.tags || []) {
        const key = String(tag).trim().toLowerCase();
        if (!key) continue;
        weakTagMap.set(key, (weakTagMap.get(key) || 0) + 1);
      }
    }
  }

  const topSolvedTags = pickTopTags(solvedTagMap, 5);
  const topWeakTags = pickTopTags(weakTagMap, 5);

  const unseenProblems = problems.filter((problem) => !attemptedProblemIds.has(problem.id));
  const attemptedButUnsolved = problems.filter(
    (problem) =>
      attemptedProblemIds.has(problem.id) && !acceptedProblemIds.has(problem.id)
  );

  const matchByTags = (problem, tags) => {
    const normalized = (problem.tags || []).map((tag) =>
      String(tag).trim().toLowerCase()
    );

    return tags.some((item) => normalized.includes(item.tag));
  };

  const beginner = problems
    .filter(
      (problem) =>
        normalizeDifficulty(problem.difficulty) === "Easy" &&
        !acceptedProblemIds.has(problem.id)
    )
    .sort((a, b) => {
      const aMatch = matchByTags(a, topWeakTags) ? 1 : 0;
      const bMatch = matchByTags(b, topWeakTags) ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 10);

  const intermediate = problems
    .filter(
      (problem) =>
        normalizeDifficulty(problem.difficulty) === "Medium" &&
        !acceptedProblemIds.has(problem.id)
    )
    .sort((a, b) => {
      const aWeak = matchByTags(a, topWeakTags) ? 1 : 0;
      const bWeak = matchByTags(b, topWeakTags) ? 1 : 0;
      if (bWeak !== aWeak) return bWeak - aWeak;

      const aSolved = matchByTags(a, topSolvedTags) ? 1 : 0;
      const bSolved = matchByTags(b, topSolvedTags) ? 1 : 0;
      return bSolved - aSolved;
    })
    .slice(0, 10);

  const advanced = problems
    .filter(
      (problem) =>
        normalizeDifficulty(problem.difficulty) === "Hard" &&
        !acceptedProblemIds.has(problem.id)
    )
    .sort((a, b) => {
      const aWeak = matchByTags(a, topWeakTags) ? 1 : 0;
      const bWeak = matchByTags(b, topWeakTags) ? 1 : 0;
      return bWeak - aWeak;
    })
    .slice(0, 10);

  const retryBucket = attemptedButUnsolved
    .sort((a, b) => {
      const aWeak = matchByTags(a, topWeakTags) ? 1 : 0;
      const bWeak = matchByTags(b, topWeakTags) ? 1 : 0;
      return bWeak - aWeak;
    })
    .slice(0, 10);

  const discoveryBucket = unseenProblems
    .sort((a, b) => {
      const aWeak = matchByTags(a, topWeakTags) ? 1 : 0;
      const bWeak = matchByTags(b, topWeakTags) ? 1 : 0;
      if (bWeak !== aWeak) return bWeak - aWeak;

      const aSolved = matchByTags(a, topSolvedTags) ? 1 : 0;
      const bSolved = matchByTags(b, topSolvedTags) ? 1 : 0;
      return bSolved - aSolved;
    })
    .slice(0, 12);

  const summary = {
    totalSolved: acceptedProblemIds.size,
    totalAttempted: attemptedProblemIds.size,
    strongestDifficulty:
      [...solvedDifficultyMap.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "-",
    solvedTags: topSolvedTags,
    weakTags: topWeakTags,
  };

  const formatProblems = (items) =>
    items.map((problem) => ({
      id: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: normalizeDifficulty(problem.difficulty),
      tags: problem.tags || [],
      isPremium: !!problem.isPremium,
    }));

  return {
    summary,
    sections: [
      {
        key: "retry-unsolved",
        title: "Retry Your Weak Spots",
        description:
          "Problems you already touched but still haven’t solved. This is the highest signal bucket.",
        problems: formatProblems(retryBucket),
      },
      {
        key: "beginner-growth",
        title: "Beginner Growth",
        description:
          "Easy problems picked from your weak topics so your basics stop leaking.",
        problems: formatProblems(beginner),
      },
      {
        key: "intermediate-push",
        title: "Intermediate Push",
        description:
          "Medium problems based on your current profile so progress actually compounds.",
        problems: formatProblems(intermediate),
      },
      {
        key: "advanced-stretch",
        title: "Advanced Stretch",
        description:
          "Hard problems for depth building once your base starts stabilizing.",
        problems: formatProblems(advanced),
      },
      {
        key: "discovery",
        title: "Recommended Discovery",
        description:
          "Fresh unsolved problems selected from your solved and weak topic mix.",
        problems: formatProblems(discoveryBucket),
      },
    ],
  };
};