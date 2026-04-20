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

export const loadRazorpayScript = async (): Promise<boolean> => {
  if ((window as any).Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    ) as HTMLScriptElement | null;

    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};