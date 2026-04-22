import API from "./axios";

export const getRoadmapApi = async () => {
  const response = await API.get("/roadmap");
  return response.data;
};