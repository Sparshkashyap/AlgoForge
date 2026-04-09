import prisma from "../config/db.js";
import { makeSlug } from "../utils/slug.js";

export const listProblemsService = async () => {
  return prisma.problem.findMany({
    orderBy: { createdAt: "desc" }
  });
};

export const getProblemBySlugService = async (slug) => {
  const problem = await prisma.problem.findUnique({
    where: { slug }
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  return problem;
};

export const createProblemService = async (payload) => {
  const slug = makeSlug(payload.title);

  const existing = await prisma.problem.findUnique({
    where: { slug }
  });

  if (existing) {
    const error = new Error("Problem with same title already exists");
    error.statusCode = 409;
    throw error;
  }

  return prisma.problem.create({
    data: {
      title: payload.title,
      slug,
      description: payload.description,
      difficulty: payload.difficulty,
      tags: payload.tags || [],
      starterCode: payload.starterCode || {}
    }
  });
};