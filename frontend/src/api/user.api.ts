import API from "./axios";

export const getMyProfileApi = async () => {
  const response = await API.get("/users/me");
  return response.data;
};

export const updateMyProfileApi = async (payload: {
  name?: string;
  email?: string;
  avatarUrl?: string;
}) => {
  const response = await API.put("/users/me", payload);
  return response.data;
};

export const uploadAvatarApi = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await API.post("/users/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMySolveStatsApi = async () => {
  const response = await API.get("/users/stats");
  return response.data;
};

export const getMyBadgesApi = async () => {
  const response = await API.get("/users/badges");
  return response.data;
};

export const getMyNotificationsApi = async () => {
  const response = await API.get("/users/notifications");
  return response.data;
};

export const getMyNotificationSummaryApi = async () => {
  const response = await API.get("/users/notifications/summary");
  return response.data;
};

export const markNotificationReadApi = async (notificationId: string) => {
  const response = await API.patch(
    `/users/notifications/${notificationId}/read`
  );
  return response.data;
};

export const markAllNotificationsReadApi = async () => {
  const response = await API.patch("/users/notifications/read-all");
  return response.data;
};

export const getDailyQuestionApi = async () => {
  const response = await API.get("/daily-question/today");
  return response.data;
};

export const markDailyQuestionAttemptApi = async (payload: {
  dailyQuestionId: string;
  status: string;
}) => {
  const response = await API.post("/daily-question/attempt", payload);
  return response.data;
};

export const getLeaderboardApi = async () => {
  const response = await API.get("/users/leaderboard");
  return response.data;
};