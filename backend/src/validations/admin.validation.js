import { z } from "zod";

const userIdParam = z.object({
  userId: z.string().min(1, "userId is required"),
});

export const adminUserIdParamSchema = z.object({
  body: z.object({}),
  params: userIdParam,
  query: z.object({}),
});

export const updateUserRoleSchema = z.object({
  body: z.object({
    role: z.enum(["USER", "CREATOR", "ADMIN"]),
  }),
  params: userIdParam,
  query: z.object({}),
});

export const blockUserSchema = z.object({
  body: z.object({
    reason: z.string().trim().max(250).optional(),
  }),
  params: userIdParam,
  query: z.object({}),
});