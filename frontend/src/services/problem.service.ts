import api from "@/lib/api";

type ProblemPayload = Record<string, unknown>;

export const getProblemsApi = async (
  params?: Record<string, string | number>
) => {
  const response = await api.get("/problems", { params });
  return response.data;
};

export const getProblemBySlugApi = async (slug: string) => {
  const response = await api.get(`/problems/${slug}`);
  return response.data;
};

export const createProblemApi = async (payload: ProblemPayload) => {
  const response = await api.post("/problems", payload);
  return response.data;
};

export const updateProblemApi = async (id: string, payload: ProblemPayload) => {
  const response = await api.put(`/problems/${id}`, payload);
  return response.data;
};

export const deleteProblemApi = async (id: string) => {
  const response = await api.delete(`/problems/${id}`);
  return response.data;
};