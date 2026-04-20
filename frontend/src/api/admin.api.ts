import API from "./axios";

export const getAdminSummaryApi = async () => {
  const response = await API.get("/admin/summary");
  return response.data;
};

export const listAdminUsersApi = async () => {
  const response = await API.get("/admin/users");
  return response.data;
};

export const updateUserRoleApi = async (userId: string, role: string) => {
  const response = await API.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const blockUserApi = async (userId: string, reason?: string) => {
  const response = await API.put(`/admin/users/${userId}/block`, { reason });
  return response.data;
};

export const unblockUserApi = async (userId: string) => {
  const response = await API.put(`/admin/users/${userId}/unblock`);
  return response.data;
};

export const listAuditLogsApi = async () => {
  const response = await API.get("/admin/audit-logs");
  return response.data;
};