import API from "./axios";

export const createSubmissionApi = (payload: {
  problemId: string;
  language: string;
  code: string;
}) => API.post("/submissions", payload);

export const getMySubmissionsApi = () => API.get("/submissions/me");