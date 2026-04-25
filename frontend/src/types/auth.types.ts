import type { User } from "./user.types";

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
  recaptchaToken: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
  recaptchaToken: string;
};

export type AuthSuccessResponse = {
  success: boolean;
  message: string;
  user: User;
};