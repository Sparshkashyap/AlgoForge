import API from "./axios";

// Get all subscriptions (admin view)
export const getAllSubscriptionsApi = async () => {
  const res = await API.get("/admin/billing/subscriptions");
  return res.data;
};

// Get single subscription
export const getSubscriptionByIdApi = async (id: string) => {
  const res = await API.get(`/admin/billing/subscriptions/${id}`);
  return res.data;
};

// Cancel subscription
export const cancelSubscriptionApi = async (id: string) => {
  const res = await API.post(`/admin/billing/subscriptions/${id}/cancel`);
  return res.data;
};

// Update subscription (optional)
export const updateSubscriptionApi = async (
  id: string,
  payload: any
) => {
  const res = await API.patch(`/admin/billing/subscriptions/${id}`, payload);
  return res.data;
};