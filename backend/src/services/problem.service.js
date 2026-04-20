import prisma from "../config/db.js";
import { generateProblemSlug } from "../utils/slug.js";
import { judgeSubmission } from "./judge.service.js";
import { buildExecutableCode } from "../utils/codeWrapper.js";
import { notifyPublishedProblemService } from "./notification.service.js";

const buildProblemData = (payload, creatorUserId, slug) => ({
  title: payload.title.trim(),
  slug,
  description: payload.description.trim(),
  difficulty: payload.difficulty,
  tags: payload.tags,
  constraints: payload.constraints || null,
  isPremium: payload.isPremium ?? false,
  boilerplateMode: payload.boilerplateMode ?? "provided",
  starterCode: payload.starterCode,
  sampleInput: payload.sampleInput,
  sampleOutput: payload.sampleOutput,
  explanation: payload.explanation,
  languageTemplates: payload.languageTemplates,
  referenceSolutions: payload.referenceSolutions,
  driverCode: payload.driverCode,
  isPublished: payload.isPublished ?? false,
  createdById: creatorUserId,
});

export const listProblemsService = async () => {
  return prisma.problem.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      tags: true,
      isPremium: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getProblemBySlugService = async (slug, viewer = null) => {
  const problem = await prisma.problem.findFirst({
    where: { slug, isPublished: true },
    include: {
      testCases: {
        orderBy: { createdAt: "asc" },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const hasPremiumAccess =
    !problem.isPremium ||
    viewer?.role === "ADMIN" ||
    ["STANDARD", "PRO"].includes(viewer?.plan);

  return {
    ...problem,
    hasPremiumAccess,
  };
};

export const createProblemService = async (payload, creatorUserId) => {
  const slug = generateProblemSlug(payload.title);

  const existing = await prisma.problem.findUnique({
    where: { slug },
  });

  if (existing) {
    const error = new Error("Problem with same title/slug already exists");
    error.statusCode = 409;
    throw error;
  }

  const problem = await prisma.problem.create({
    data: {
      ...buildProblemData(payload, creatorUserId, slug),
      testCases: {
        create: payload.testCases.map((tc) => ({
          input: tc.input,
          expected: tc.expected,
          isHidden: tc.isHidden ?? true,
        })),
      },
    },
    include: {
      testCases: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (problem.isPublished) {
    await notifyPublishedProblemService({
      problemId: problem.id,
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
    });
  }

  return problem;
};

export const updateProblemService = async (problemId, payload, creatorUserId) => {
  const existing = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      title: true,
      slug: true,
      createdById: true,
      isPublished: true,
    },
  });

  if (!existing) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const actor = await prisma.user.findUnique({
    where: { id: creatorUserId },
    select: { id: true, role: true },
  });

  const canEdit =
    actor?.role === "ADMIN" || existing.createdById === creatorUserId;

  if (!canEdit) {
    const error = new Error("You are not allowed to update this problem");
    error.statusCode = 403;
    throw error;
  }

  const slug =
    existing.title === payload.title
      ? existing.slug
      : generateProblemSlug(payload.title);

  await prisma.testCase.deleteMany({
    where: { problemId },
  });

  const updated = await prisma.problem.update({
    where: { id: problemId },
    data: {
      ...buildProblemData(payload, existing.createdById, slug),
      testCases: {
        create: payload.testCases.map((tc) => ({
          input: tc.input,
          expected: tc.expected,
          isHidden: tc.isHidden ?? true,
        })),
      },
    },
    include: {
      testCases: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!existing.isPublished && updated.isPublished) {
    await notifyPublishedProblemService({
      problemId: updated.id,
      title: updated.title,
      slug: updated.slug,
      difficulty: updated.difficulty,
    });
  }

  return updated;
};

export const deleteProblemService = async (problemId, requesterUserId) => {
  const existing = await prisma.problem.findUnique({
    where: { id: problemId },
    select: {
      id: true,
      createdById: true,
    },
  });

  if (!existing) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const actor = await prisma.user.findUnique({
    where: { id: requesterUserId },
    select: { id: true, role: true },
  });

  const canDelete =
    actor?.role === "ADMIN" || existing.createdById === requesterUserId;

  if (!canDelete) {
    const error = new Error("You are not allowed to delete this problem");
    error.statusCode = 403;
    throw error;
  }

  await prisma.problem.delete({
    where: { id: problemId },
  });

  return {
    success: true,
    message: "Problem deleted successfully",
  };
};

export const listMyCreatedProblemsService = async (userId) => {
  return prisma.problem.findMany({
    where: { createdById: userId },
    orderBy: { createdAt: "desc" },
  });
};

export const previewProblemRunService = async ({
  language,
  code,
  testCases,
  driverCode,
}) => {
  const executableCode = buildExecutableCode({
    language,
    userCode: code,
    driverCode: driverCode?.[language] ?? "",
  });

  return judgeSubmission({
    language,
    code: executableCode,
    testCases,
  });
};


export const getProblemByIdForAdminService = async (problemId) => {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    include: {
      testCases: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  return problem;
};

export const listAdminProblemsService = async () => {
  return prisma.problem.findMany({
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          submissions: true,
          testCases: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};