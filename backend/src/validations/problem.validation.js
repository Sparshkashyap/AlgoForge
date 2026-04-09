import { z } from "zod";

export const createProblemSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    description: z.string().min(10),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    tags: z.array(z.string()).optional(),
    starterCode: z.record(z.string(), z.string()).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});