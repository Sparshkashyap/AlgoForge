import API from "./axios";

// Get all contests (admin view)
export const getAdminContestsApi = async () => {
  const res = await API.get("/admin/contests");
  return res.data;
};

// Create contest
export const createContestApi = async (payload: {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}) => {
  const res = await API.post("/admin/contests", payload);
  return res.data;
};

// Update contest
export const updateContestApi = async (
  contestId: string,
  payload: any
) => {
  const res = await API.patch(`/admin/contests/${contestId}`, payload);
  return res.data;
};

// Delete contest
export const deleteContestApi = async (contestId: string) => {
  const res = await API.delete(`/admin/contests/${contestId}`);
  return res.data;
};