import prisma from "../config/db.js";
import { AsyncParser } from "@json2csv/node";

export const exportUsersCsvService = async () => {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
      role: true,
      plan: true,
      solvedCount: true,
      streak: true,
      createdAt: true,
      lastSeenAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const parser = new AsyncParser();
  return parser.parse(users).promise();
};

export const exportProblemsCsvService = async () => {
  const problems = await prisma.problem.findMany({
    select: {
      title: true,
      slug: true,
      difficulty: true,
      isPremium: true,
      isPublished: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const parser = new AsyncParser();
  return parser.parse(problems).promise();
};