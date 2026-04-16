import API from "./axios";

export const getMyBillingApi = async () => {
  const response = await API.get("/billing/me");
  return response.data;
};

export const createSubscriptionCheckoutApi = async (
  tier: "STANDARD" | "PRO"
) => {
  const response = await API.post("/billing/checkout", { tier });
  return response.data;
};

export const cancelMySubscriptionApi = async () => {
  const response = await API.post("/billing/cancel");
  return response.data;
};