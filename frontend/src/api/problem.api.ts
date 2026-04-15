import API from "./axios";

export const getProblemsApi = async () => {
  const response = await API.get("/problems");
  return response.data;
};

export const getProblemBySlugApi = async (slug: string) => {
  const response = await API.get(`/problems/${slug}`);
  return response.data;
};

export const runProblemApi = async (
  problemId: string,
  payload: {
    language: "javascript" | "python" | "cpp" | "java" | "c";
    code: string;
    input: string;
    expectedOutput?: string;
  }
) => {
  const response = await API.post(`/execution/${problemId}/run`, payload);
  return response.data;
};