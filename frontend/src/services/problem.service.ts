import api from "@/lib/api";

export const getProblemsApi = async (
  params?: Record<string, string | number>
) => {
  try {
    const response = await api.get("/problems", { params });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getProblemBySlugApi = async (slug: string) => {
  try {
    const response = await api.get(`/problems/${slug}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const createProblemApi = async (payload: any) => {
  try {
    const response = await api.post("/problems", payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateProblemApi = async (id: string, payload: any) => {
  try {
    const response = await api.put(`/problems/${id}`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteProblemApi = async (id: string) => {
  try {
    const response = await api.delete(`/problems/${id}`);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};