import API from "./axios";

export const listMyNotificationsApi = async () => {
  const response = await API.get("/notifications/me");
  return response.data;
};

export const markNotificationReadApi = async (notificationId: string) => {
  const response = await API.put(`/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsReadApi = async () => {
  const response = await API.put("/notifications/read-all");
  return response.data;
};