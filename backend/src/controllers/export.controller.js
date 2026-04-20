import prisma from "../config/db.js";

const toCsv = (rows) => {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);

  const escapeValue = (value) => {
    const stringValue = String(value ?? "");
    if (
      stringValue.includes(",") ||
      stringValue.includes('"') ||
      stringValue.includes("\n")
    ) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const headerLine = headers.join(",");
  const lines = rows.map((row) =>
    headers.map((header) => escapeValue(row[header])).join(",")
  );

  return [headerLine, ...lines].join("\n");
};

export const exportUsersController = async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        solvedCount: true,
        streak: true,
        isBlocked: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const csv = toCsv(users);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="users.csv"');

    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportSubmissionsController = async (_req, res, next) => {
  try {
    const submissions = await prisma.submission.findMany({
      select: {
        id: true,
        language: true,
        status: true,
        verdict: true,
        passedCount: true,
        totalCount: true,
        createdAt: true,
        userId: true,
        problemId: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const csv = toCsv(submissions);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="submissions.csv"'
    );

    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

export const exportProblemsController = async (_req, res, next) => {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        isPremium: true,
        isPublished: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const csv = toCsv(problems);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="problems.csv"'
    );

    return res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};