  import API from "./axios";
  import type { LoginPayload, SignupPayload } from "@/types/auth.types";

  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  export const signupApi = async (payload: SignupPayload) => {
    const response = await API.post("/auth/signup", payload);
    return response.data;
  };

  export const loginApi = async (payload: LoginPayload) => {
    const response = await API.post("/auth/login", payload);
    return response.data;
  };

  export const logoutApi = async () => {
    const response = await API.post("/auth/logout");
    return response.data;
  };

  export const meApi = async () => {
    const response = await API.get("/auth/me");
    return response.data;
  };

  export const forgotPasswordApi = async (payload: {
    email: string;
    recaptchaToken: string;
  }) => {
    const response = await API.post("/auth/forgot-password-otp", payload);
    return response.data;
  };

  export const verifyResetOtpApi = async (payload: {
    email: string;
    otp: string;
    recaptchaToken: string;
  }) => {
    const response = await API.post("/auth/verify-reset-otp", payload);
    return response.data;
  };

  export const resetPasswordApi = async (payload: {
    verificationToken: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await API.post(
      "/auth/reset-password-with-otp",
      payload
    );
    return response.data;
  };

  export const startGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  export const startGithubLogin = () => {
    window.location.href = `${BASE_URL}/auth/github`;
  };