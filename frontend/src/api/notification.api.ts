import API from "./axios";

export const listMyNotificationsApi = async () => {
  const response = await API.get("/users/notifications");
  return response.data;
};

export const getMyNotificationSummaryApi = async () => {
  const response = await API.get("/users/notifications/summary");
  return response.data;
};

export const markNotificationReadApi = async (notificationId: string) => {
  const response = await API.patch(
    `/users/notifications/${notificationId}/read`
  );
  return response.data;
};

export const markAllNotificationsReadApi = async () => {
  const response = await API.patch("/users/notifications/read-all");
  return response.data;
};