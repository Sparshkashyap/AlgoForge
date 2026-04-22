import API from "./axios";

export type PublicPlan = {
  code: "FREE" | "STANDARD" | "PRO";
  name: string;
  amountInPaise: number;
  currency: string;
  active: boolean;
  visibleToRoles: string[];
  features: string[];
};

const extractBlobOrJsonErrorMessage = async (error: any) => {
  try {
    const data = error?.response?.data;

    if (data instanceof Blob) {
      const text = await data.text();
      const parsed = JSON.parse(text);
      return parsed?.message || "Request failed";
    }

    return error?.response?.data?.message || error?.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

export const getPublicPricingPlansApi = async () => {
  const response = await API.get("/billing/plans");
  return response.data;
};

export const getMyBillingApi = async () => {
  const response = await API.get("/billing/me");
  return response.data;
};

export const createSubscriptionCheckoutApi = async (
  tier: "STANDARD" | "PRO"
) => {
  try {
    const response = await API.post("/billing/checkout", { tier });
    return response.data;
  } catch (error) {
    throw new Error(await extractBlobOrJsonErrorMessage(error));
  }
};

export const cancelMySubscriptionApi = async () => {
  try {
    const response = await API.post("/billing/cancel");
    return response.data;
  } catch (error) {
    throw new Error(await extractBlobOrJsonErrorMessage(error));
  }
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