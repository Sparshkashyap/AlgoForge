import API from "./axios";

export const listContestsApi = async () => {
  const response = await API.get("/contests");
  return response.data;
};

export const getContestByIdApi = async (contestId: string) => {
  const response = await API.get(`/contests/${contestId}`);
  return response.data;
};

export const getContestRankingApi = async (contestId: string) => {
  const response = await API.get(`/contests/${contestId}/ranking`);
  return response.data;
};

export const registerForContestApi = async (contestId: string) => {
  const response = await API.post(`/contests/${contestId}/register`);
  return response.data;
};

export const listMyCreatedContestsApi = async () => {
  const response = await API.get("/contests/me/list");
  return response.data;
};

export const createContestApi = async (payload: {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  isPublished?: boolean;
  problemIds: string[];
}) => {
  const response = await API.post("/contests", payload);
  return response.data;
};

export const updateContestApi = async (
  contestId: string,
  payload: {
    title?: string;
    description?: string;
    startAt?: string;
    endAt?: string;
    isPublished?: boolean;
    problemIds?: string[];
  }
) => {
  const response = await API.put(`/contests/${contestId}`, payload);
  return response.data;
};

export const deleteContestApi = async (contestId: string) => {
  const response = await API.delete(`/contests/${contestId}`);
  return response.data;
};