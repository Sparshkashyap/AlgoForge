import API from "./axios";

export const createSubmissionApi = async (payload: {
  problemId: string;
  language: "javascript" | "python" | "cpp" | "java" | "c";
  code: string;
}) => {
  const response = await API.post("/submissions", payload);
  return response.data;
};

export const getMySubmissionsApi = async () => {
  const response = await API.get("/submissions/me");
  return response.data;
};