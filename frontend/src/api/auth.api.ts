import API from "./axios";

export type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const signupApi = (payload: SignupPayload) => API.post("/auth/signup", payload);
export const loginApi = (payload: LoginPayload) => API.post("/auth/login", payload);
export const meApi = () => API.get("/auth/me");
export const logoutApi = () => API.post("/auth/logout");