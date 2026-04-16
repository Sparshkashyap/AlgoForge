import API from "./axios";

export const signupApi = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await API.post("/auth/signup", payload);
  return response.data;
};

export const loginApi = async (payload: {
  email: string;
  password: string;
}) => {
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

export const forgotPasswordApi = async (email: string) => {
  const response = await API.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async (payload: {
  token: string;
  password: string;
}) => {
  const response = await API.post("/auth/reset-password", payload);
  return response.data;
};

export const startGoogleLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
};

export const startGithubLogin = () => {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`;
};