import API from "./axios";
import type {
  AuthSuccessResponse,
  LoginPayload,
  SignupPayload,
} from "@/types/auth.types";
import type { User } from "@/types/user.types";

export const signupApi = async (payload: SignupPayload) => {
  const response = await API.post<AuthSuccessResponse>("/auth/signup", payload);
  return response.data;
};

export const loginApi = async (payload: LoginPayload) => {
  const response = await API.post<AuthSuccessResponse>("/auth/login", payload);
  return response.data;
};

export const meApi = async () => {
  const response = await API.get<{ success: boolean; user: User }>("/auth/me");
  return response.data;
};

export const logoutApi = async () => {
  const response = await API.post<{ success: boolean; message: string }>(
    "/auth/logout"
  );
  return response.data;
};