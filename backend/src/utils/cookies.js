import env from "../config/env.js";

export const setAuthCookie = (res, token) => {
  const isProduction = env.NODE_ENV === "production";

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

export const clearAuthCookie = (res) => {
  const isProduction = env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};