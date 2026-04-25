import env from "../config/env.js";

export const verifyRecaptchaToken = async ({ token, remoteIp }) => {
  if (!env.RECAPTCHA_SECRET_KEY) {
    const error = new Error("reCAPTCHA secret key is not configured");
    error.statusCode = 500;
    throw error;
  }

  if (!token) {
    const error = new Error("Please complete the reCAPTCHA");
    error.statusCode = 400;
    throw error;
  }

  const params = new URLSearchParams();
  params.append("secret", env.RECAPTCHA_SECRET_KEY);
  params.append("response", token);

  if (remoteIp) {
    params.append("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  const data = await response.json();

  if (!data.success) {
    const error = new Error("reCAPTCHA verification failed");
    error.statusCode = 400;
    error.details = data["error-codes"] || [];
    throw error;
  }

  return data;
};