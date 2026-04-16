import API from "./axios";

export const getMyProfileApi = async () => {
  const response = await API.get("/users/me");
  return response.data;
};

export const updateMyProfileApi = async (payload: {
  name: string;
  email: string;
}) => {
  const response = await API.patch("/users/me", payload);
  return response.data;
};

export const uploadAvatarApi = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await API.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};



export const getMyBadgesApi = async () => {
  const response = await API.get("/users/me/badges");
  return response.data;
};

export const getDailyQuestionApi = async () => {
  const response = await API.get("/daily-question");
  return response.data;
};

export const markDailyQuestionAttemptApi = async (payload: {
  dailyQuestionId: string;
  status: string;
}) => {
  const response = await API.post("/daily-question/attempt", payload);
  return response.data;
};