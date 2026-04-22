import API from "./axios";

export const getGlobalLeaderboardApi = async () => {
  const response = await API.get("/leaderboard/global");
  return response.data;
};