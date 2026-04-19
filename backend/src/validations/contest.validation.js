import { z } from "zod";

export const createContestSchema = z.object({
  body: z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    description: z.string().trim().optional().nullable(),
    startAt: z.string().min(1, "startAt is required"),
    endAt: z.string().min(1, "endAt is required"),
    isPublished: z.boolean().optional().default(false),
    problemIds: z.array(z.string().min(1)).optional().default([]),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const contestIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({
    contestId: z.string().min(1, "contestId is required"),
  }),
  query: z.object({}),
});