import API from "./axios";

export const listProblemsForReviewApi = async () => {
  const response = await API.get("/problem-reviews");
  return response.data;
};

export const approveProblemApi = async (problemId: string) => {
  const response = await API.patch(`/problem-reviews/${problemId}/approve`);
  return response.data;
};

export const rejectProblemApi = async (problemId: string, reason: string) => {
  const response = await API.patch(`/problem-reviews/${problemId}/reject`, {
    reason,
  });
  return response.data;
};