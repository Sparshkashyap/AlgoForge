import prisma from "../config/db.js";

const normalizeVerdict = (value) => {
  const v = String(value || "").trim().toLowerCase();

  if (v === "accepted") return "Accepted";
  if (v === "wrong answer") return "Wrong Answer";
  if (v === "runtime error") return "Runtime Error";
  if (v === "compilation error") return "Compilation Error";
  if (v === "time limit exceeded") return "Time Limit Exceeded";
  if (v === "memory limit exceeded") return "Memory Limit Exceeded";
  if (v) {
    return v
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return "Unknown";
};

const normalizeDifficulty = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (v === "easy") return "Easy";
  if (v === "medium") return "Medium";
  if (v === "hard") return "Hard";
  return "Unknown";
};

const normalizeLanguage = (value) => {
  const v = String(value || "").trim().toLowerCase();
  if (!v) return "Unknown";

  const map = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    python: "Python",
    cpp: "C++",
    c: "C",
    java: "Java",
    go: "Go",
    rust: "Rust",
  };

  return map[v] || value;
};

export const getMySubmissionAnalyticsService = async (userId) => {
  const submissions = await prisma.submission.findMany({
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
    orderBy: {
      createdAt: "asc",
    },
  });

  const totals = {
    total: submissions.length,
    accepted: 0,
    wrongAnswer: 0,
    runtimeError: 0,
    compilationError: 0,
    timeLimitExceeded: 0,
    memoryLimitExceeded: 0,
    unknown: 0,
  };

  const difficulty = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Unknown: 0,
  };

  const languageUsageMap = new Map();
  const verdictMap = new Map();
  const solvedProblemIds = new Set();
  const acceptedByDateMap = new Map();

  for (const sub of submissions) {
    const verdict = normalizeVerdict(sub.verdict || sub.status);
    const diff = normalizeDifficulty(sub.problem?.difficulty);
    const language = normalizeLanguage(sub.language);

    verdictMap.set(verdict, (verdictMap.get(verdict) || 0) + 1);
    languageUsageMap.set(language, (languageUsageMap.get(language) || 0) + 1);

    if (verdict === "Accepted") {
      totals.accepted += 1;
      difficulty[diff] = (difficulty[diff] || 0) + 1;

      if (sub.problemId) {
        solvedProblemIds.add(sub.problemId);
      }

      const dayKey = new Date(sub.createdAt).toISOString().slice(0, 10);
      acceptedByDateMap.set(dayKey, (acceptedByDateMap.get(dayKey) || 0) + 1);
    } else if (verdict === "Wrong Answer") {
      totals.wrongAnswer += 1;
    } else if (verdict === "Runtime Error") {
      totals.runtimeError += 1;
    } else if (verdict === "Compilation Error") {
      totals.compilationError += 1;
    } else if (verdict === "Time Limit Exceeded") {
      totals.timeLimitExceeded += 1;
    } else if (verdict === "Memory Limit Exceeded") {
      totals.memoryLimitExceeded += 1;
    } else {
      totals.unknown += 1;
    }
  }

  const acceptanceRate =
    totals.total > 0 ? Number(((totals.accepted / totals.total) * 100).toFixed(1)) : 0;

  const verdictBreakdown = [...verdictMap.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const languageUsage = [...languageUsageMap.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const recent = submissions.slice(-12).reverse().map((s) => ({
    id: s.id,
    verdict: normalizeVerdict(s.verdict || s.status),
    createdAt: s.createdAt,
    language: normalizeLanguage(s.language),
    runtime: s.runtime,
    memory: s.memory,
    passedCount: s.passedCount,
    totalCount: s.totalCount,
    problemTitle: s.problem?.title || "Unknown",
    problemSlug: s.problem?.slug || "",
    difficulty: normalizeDifficulty(s.problem?.difficulty),
  }));

  const activityTrend = [...acceptedByDateMap.entries()]
    .map(([date, solvedCount]) => ({ date, solvedCount }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);

  const strongestDifficulty = Object.entries(difficulty)
    .filter(([key]) => key !== "Unknown")
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const summary = {
    totalSolvedProblems: solvedProblemIds.size,
    totalSubmissions: totals.total,
    totalAcceptedSubmissions: totals.accepted,
    acceptanceRate,
    strongestDifficulty,
    mostUsedLanguage: languageUsage[0]?.label || "-",
  };

  return {
    summary,
    totals,
    difficulty,
    verdictBreakdown,
    languageUsage,
    activityTrend,
    recent,
  };
};