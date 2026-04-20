import axios from "axios";
import env from "../config/env.js";

export const verifyRecaptcha = async (token) => {
  const response = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    null,
    {
      params: {
        secret: env.RECAPTCHA_SECRET_KEY,
        response: token,
      },
    }
  );

  const data = response.data;

  if (!data.success || data.score < env.RECAPTCHA_MIN_SCORE) {
    throw new Error("reCAPTCHA verification failed");
  }

  return true;
};