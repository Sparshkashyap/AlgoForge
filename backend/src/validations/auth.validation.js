import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(4, "Password must be at least 6 characters"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),
  params: z.object({}),
  query: z.object({}),
});