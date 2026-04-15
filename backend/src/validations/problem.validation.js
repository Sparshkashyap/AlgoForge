import { z } from "zod";

const codeMapSchema = z.record(z.string(), z.string()).optional().default({});

const testCaseSchema = z.object({
  input: z.string().min(1, "Test case input is required"),
  expected: z.string().min(1, "Expected output is required"),
  isHidden: z.boolean().optional().default(true),
});

const problemBodySchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(20, "Description is too short"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  tags: z.array(z.string().trim().min(1)).min(1, "At least one tag is required"),
  constraints: z.string().optional().nullable(),
  isPremium: z.boolean().optional().default(false),
  boilerplateMode: z.enum(["provided", "optional", "none"]).optional().default("provided"),
  sampleInput: z.string().optional().nullable(),
  sampleOutput: z.string().optional().nullable(),
  explanation: z.string().optional().nullable(),
  starterCode: codeMapSchema,
  languageTemplates: codeMapSchema,
  referenceSolutions: codeMapSchema,
  driverCode: codeMapSchema,
  isPublished: z.boolean().optional().default(false),
  testCases: z.array(testCaseSchema).min(1, "At least one test case is required"),
});

export const createProblemSchema = z.object({
  body: problemBodySchema,
  params: z.object({}),
  query: z.object({}),
});

export const previewProblemRunSchema = z.object({
  body: z.object({
    language: z.enum(["javascript", "python", "cpp", "java", "c"]),
    code: z.string().min(1, "Code is required"),
    driverCode: codeMapSchema,
    testCases: z.array(testCaseSchema).min(1, "At least one test case is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const runProblemSchema = z.object({
  body: z.object({
    language: z.enum(["javascript", "python", "cpp", "java", "c"]),
    code: z.string().min(1, "Code is required"),
    input: z.string().optional().default(""),
    expectedOutput: z.string().optional().default(""),
  }),
  params: z.object({
    problemId: z.string().min(1, "problemId is required"),
  }),
  query: z.object({}),
});