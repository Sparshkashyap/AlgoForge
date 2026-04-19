import env from "../config/env.js";

export const verifyRecaptchaToken = async ({
  token,
  remoteIp,
  expectedAction,
}) => {
  if (!env.RECAPTCHA_SECRET_KEY) {
    const error = new Error("reCAPTCHA secret key is not configured");
    error.statusCode = 500;
    throw error;
  }

  if (!token) {
    const error = new Error("reCAPTCHA token is required");
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
    throw error;
  }

  if (expectedAction && data.action && data.action !== expectedAction) {
    const error = new Error("Invalid reCAPTCHA action");
    error.statusCode = 400;
    throw error;
  }

  if (typeof data.score === "number" && data.score < env.RECAPTCHA_MIN_SCORE) {
    const error = new Error("reCAPTCHA score too low");
    error.statusCode = 400;
    throw error;
  }

  return data;
};