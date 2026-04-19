import API from "@/api/axios";

/* ================= USERS ================= */

export const getAdminUsersApi = async () => {
  try {
    const res = await API.get("/admin/users");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateUserRoleApi = async (
  userId: string,
  role: "USER" | "CREATOR" | "ADMIN"
) => {
  try {
    const res = await API.patch(`/admin/users/${userId}/role`, { role });
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/* ================= ANALYTICS ================= */

export const getAdminAnalyticsApi = async () => {
  try {
    const res = await API.get("/admin/analytics");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

/* ================= PROBLEMS ================= */

export const getAdminProblemsApi = async () => {
  try {
    const res = await API.get("/admin/problems");
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAdminProblemByIdApi = async (id: string) => {
  try {
    const res = await API.get(`/admin/problems/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteProblemApi = async (id: string) => {
  try {
    const res = await API.delete(`/admin/problems/${id}`);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};