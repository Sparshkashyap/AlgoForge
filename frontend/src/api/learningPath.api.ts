import API from "./axios";

export const listLearningPathsApi = async () => {
  const response = await API.get("/learning-paths");
  return response.data;
};

export const getLearningPathByIdApi = async (pathId: string) => {
  const response = await API.get(`/learning-paths/${pathId}`);
  return response.data;
};

export const createLearningPathApi = async (payload: {
  title: string;
  description?: string;
  audience?: string;
  problemIds: string[];
}) => {
  const response = await API.post("/learning-paths", payload);
  return response.data;
};