import API from "./axios";

export const getAdminStatsApi = async () => {
  const response = await API.get("/admin/stats");
  return response.data;
};

export const getAdminUsersApi = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};

export const updateUserRoleApi = async (
  userId: string,
  role: "USER" | "CREATOR" | "ADMIN"
) => {
  const response = await API.patch(`/admin/users/${userId}/role`, { role });
  return response.data;
};



export const getAdminAnalyticsApi = async () => {
  const response = await API.get("/admin/analytics");
  return response.data;
};