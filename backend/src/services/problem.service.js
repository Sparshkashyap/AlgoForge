import prisma from "../config/db.js";
import { generateProblemSlug } from "../utils/slug.js";
import { judgeSubmission } from "./judge.service.js";
import { buildExecutableCode } from "../utils/codeWrapper.js";

const buildProblemData = (payload, adminUserId, slug) => ({
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
  createdById: adminUserId,
});

export const createProblemService = async (payload, adminUserId) => {
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
      ...buildProblemData(payload, adminUserId, slug),
      testCases: {
        create: payload.testCases.map((testCase) => ({
          input: testCase.input,
          expected: testCase.expected,
          isHidden: testCase.isHidden ?? true,
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

  return problem;
};

export const updateProblemService = async (problemId, payload, adminUserId) => {
  const existing = await prisma.problem.findUnique({
    where: { id: problemId },
  });

  if (!existing) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
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
      ...buildProblemData(payload, adminUserId, slug),
      testCases: {
        create: payload.testCases.map((testCase) => ({
          input: testCase.input,
          expected: testCase.expected,
          isHidden: testCase.isHidden ?? true,
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

  return updated;
};

export const deleteProblemService = async (problemId) => {
  const existing = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true },
  });

  if (!existing) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
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

export const previewProblemRunService = async ({
  language,
  code,
  testCases,
  driverCode,
}) => {
  const executableCode = buildExecutableCode({
    language,
    userCode: code,
    driverCode: driverCode?.[language],
  });

  return judgeSubmission({
    language,
    code: executableCode,
    testCases,
  });
};

export const listPublishedProblemsService = async () => {
  return prisma.problem.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      difficulty: true,
      tags: true,
      constraints: true,
      isPremium: true,
      sampleInput: true,
      sampleOutput: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProblemBySlugService = async (slug, viewer = null) => {
  const problem = await prisma.problem.findFirst({
    where: {
      slug,
      isPublished: true,
    },
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
    !problem.isPremium || viewer?.role === "ADMIN" || viewer?.plan === "PRO";

  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    description: problem.description,
    difficulty: problem.difficulty,
    tags: problem.tags,
    constraints: problem.constraints,
    starterCode: problem.starterCode,
    sampleInput: problem.sampleInput,
    sampleOutput: problem.sampleOutput,
    explanation: problem.explanation,
    languageTemplates: problem.languageTemplates,
    referenceSolutions: undefined,
    driverCode: undefined,
    isPremium: problem.isPremium,
    hasPremiumAccess,
    boilerplateMode: problem.boilerplateMode,
    createdAt: problem.createdAt,
    updatedAt: problem.updatedAt,
    createdBy: problem.createdBy,
    testCases: problem.testCases.map((tc) => ({
      id: tc.id,
      input: tc.input,
      expected: tc.expected,
      isHidden: tc.isHidden,
    })),
  };
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