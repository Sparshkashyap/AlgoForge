import { z } from "zod";

export const createSubmissionSchema = z.object({
  body: z.object({
    problemId: z.string().min(1),
    language: z.string().min(1),
    code: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});