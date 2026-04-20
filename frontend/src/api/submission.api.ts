import API from "./axios";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "c";

export const createSubmissionApi = async (payload: {
  problemId: string;
  language: SupportedLanguage;
  code: string;
}) => {
  const response = await API.post("/submissions", payload);
  return response.data;
};

export const getMySubmissionsApi  = async () => {
  const response = await API.get("/submissions/me");
  return response.data;
};

export const getSubmissionByIdApi = async (submissionId: string) => {
  const response = await API.get(`/submissions/${submissionId}`);
  return response.data;
};