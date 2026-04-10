import API from "@/api/axios";

export const signupUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await API.post("/auth/signup", payload);
  return res.data;
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const res = await API.post("/auth/login", payload);
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

export const logoutUser = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};