import { z } from "zod";

export const createSubmissionSchema = z.object({
  body: z.object({
    problemId: z.string().min(1, "problemId is required"),
    language: z.enum(["javascript", "python", "cpp", "java", "c"]),
    code: z.string().min(1, "Code is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});