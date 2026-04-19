import API from "@/api/axios";

// Create a submission (main judge flow)
export const createSubmissionApi = async (payload: {
  problemId: string;
  language: string;
  code: string;
}) => {
  const res = await API.post("/submissions", payload);
  return res.data;
};

// Get all submissions of current user
export const getMySubmissionsApi = async () => {
  const res = await API.get("/submissions/me");
  return res.data;
};

// Get submissions for a specific problem (useful for ProblemDetails page)
export const getSubmissionsByProblemApi = async (problemId: string) => {
  const res = await API.get(`/submissions/problem/${problemId}`);
  return res.data;
};

// Get single submission details (for deep view / debug)
export const getSubmissionByIdApi = async (submissionId: string) => {
  const res = await API.get(`/submissions/${submissionId}`);
  return res.data;
};

// Re-run a submission (optional but powerful feature)
export const reRunSubmissionApi = async (submissionId: string) => {
  const res = await API.post(`/submissions/${submissionId}/rerun`);
  return res.data;
};