import type { User } from "./user.types";

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthSuccessResponse = {
  success: boolean;
  message: string;
  user: User;
};