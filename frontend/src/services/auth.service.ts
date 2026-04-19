import API from "@/api/axios";

export const signupUserApi = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const res = await API.post("/auth/signup", payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const loginUserApi = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const res = await API.post("/auth/login", payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getMeApi = async () => {
  try {
    const res = await API.get("/auth/me");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const logoutUserApi = async () => {
  try {
    const res = await API.post("/auth/logout");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};