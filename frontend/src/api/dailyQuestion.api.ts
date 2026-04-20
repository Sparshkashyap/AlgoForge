import API from "./axios";

export const getTodayDailyQuestionApi = async () => {
  const response = await API.get("/daily-question/today");
  return response.data;
};

export const getMyDailyQuestionAttemptApi = async (dailyQuestionId: string) => {
  const response = await API.get(`/daily-question/attempt/${dailyQuestionId}`);
  return response.data;
};

export const markDailyQuestionAttemptApi = async (payload: {
  dailyQuestionId: string;
  status: string;
}) => {
  const response = await API.post("/daily-question/attempt", payload);
  return response.data;
};