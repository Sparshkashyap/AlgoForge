import API from "@/api/axios";

/* ================= USERS ================= */

export const getAdminUsersApi = async () => {
  const res = await API.get("/admin/users");
  return res.data;
};

export const updateUserRoleApi = async (
  userId: string,
  role: "USER" | "CREATOR" | "ADMIN"
) => {
  const res = await API.patch(`/admin/users/${userId}/role`, { role });
  return res.data;
};

/* ================= ANALYTICS ================= */

export const getAdminAnalyticsApi = async () => {
  const res = await API.get("/admin/analytics");
  return res.data;
};

/* ================= PROBLEMS ================= */

export const getAdminProblemsApi = async () => {
  const res = await API.get("/admin/problems");
  return res.data;
};

export const getAdminProblemByIdApi = async (id: string) => {
  const res = await API.get(`/admin/problems/${id}`);
  return res.data;
};

export const deleteProblemApi = async (id: string) => {
  const res = await API.delete(`/admin/problems/${id}`);
  return res.data;
};