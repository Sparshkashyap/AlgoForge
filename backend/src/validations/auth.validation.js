import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: z.string().min(6),
    recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
    recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const requestPasswordResetSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1),
    password: z.string().min(6),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const requestPasswordResetOtpSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const verifyPasswordResetOtpSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    otp: z.string().trim().length(6),
    recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const resetPasswordWithOtpVerificationSchema = z.object({
  body: z.object({
    verificationToken: z.string().min(1),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
  params: z.object({}),
  query: z.object({}),
});