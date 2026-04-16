import API from "./axios";

export const getProblemsApi = async () => {
  const response = await API.get("/problems");
  return response.data;
};

export const getProblemBySlugApi = async (slug: string) => {
  const response = await API.get(`/problems/${slug}`);
  return response.data;
};

export const runProblemApi = async (problemId: string, payload: any) => {
  return API.post(`/execution/${problemId}/run`, payload);
};