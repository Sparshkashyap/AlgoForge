import API from "@/api/axios";

export const signupUserApi = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await API.post("/auth/signup", payload);
  return res.data;
};

export const loginUserApi = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await API.post("/auth/login", payload);
  return res.data;
};

export const getMeApi = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const logoutUserApi = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};