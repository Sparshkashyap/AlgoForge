import prisma from "../config/db.js";

const getDateKey = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};

const buildDateRange = (days) => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  return { start, end };
};

export const getMyHeatmapService = async (userId, days = 365) => {
  const { start, end } = buildDateRange(days);

  const submissions = await prisma.submission.findMany({
    where: {
      userId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    select: {
      problemId: true,
      verdict: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const solvedPerDayMap = new Map();

  for (const sub of submissions) {
    const verdict = String(sub.verdict || sub.status || "").trim().toLowerCase();
    if (verdict !== "accepted") continue;

    const dateKey = getDateKey(sub.createdAt);

    if (!solvedPerDayMap.has(dateKey)) {
      solvedPerDayMap.set(dateKey, new Set());
    }

    solvedPerDayMap.get(dateKey).add(sub.problemId);
  }

  const result = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    const dateKey = getDateKey(cursor);
    const solvedCount = solvedPerDayMap.has(dateKey)
      ? solvedPerDayMap.get(dateKey).size
      : 0;

    result.push({
      date: dateKey,
      solvedCount,
      level:
        solvedCount === 0
          ? 0
          : solvedCount === 1
          ? 1
          : solvedCount <= 3
          ? 2
          : solvedCount <= 5
          ? 3
          : 4,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  const totalSolvedDays = result.filter((item) => item.solvedCount > 0).length;
  const maxSolvedInDay = Math.max(...result.map((item) => item.solvedCount), 0);
  const totalSolvedProblems = result.reduce(
    (sum, item) => sum + item.solvedCount,
    0
  );

  return {
    summary: {
      rangeDays: days,
      totalSolvedDays,
      maxSolvedInDay,
      totalSolvedProblems,
    },
    cells: result,
  };
};