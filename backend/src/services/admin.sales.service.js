import prisma from "../config/db.js";

export const getSalesChartService = async () => {
  const users = await prisma.user.findMany({
    where: {
      plan: {
        in: ["STANDARD", "PRO"],
      },
    },
    select: {
      id: true,
      plan: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const buckets = new Map();

  for (const user of users) {
    const date = new Date(user.createdAt);

    const year = date.getFullYear();
    const month = date.getMonth(); // 0-based month
    const key = `${year}-${month}`;

    if (!buckets.has(key)) {
      buckets.set(key, {
        year,
        month,
        STANDARD: 0,
        PRO: 0,
        revenue: 0,
      });
    }

    const bucket = buckets.get(key);

    if (user.plan === "STANDARD") {
      bucket.STANDARD += 1;
      bucket.revenue += 299;
    }

    if (user.plan === "PRO") {
      bucket.PRO += 1;
      bucket.revenue += 499;
    }
  }

  return [...buckets.values()].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });
};