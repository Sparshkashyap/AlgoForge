import {
  loginService,
  signupService,
  getMeService,
  promoteUserToAdminService
} from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";
import { getAuthCookieOptions } from "../utils/cookies.js";

export const signupController = async (req, res, next) => {
  try {
    const { name, email, password } = req.validated.body;
    const data = await signupService({ name, email, password });

    res.cookie("accessToken", data.token, getAuthCookieOptions());

    return successResponse(res, data, "Signup successful", 201);
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;
    const data = await loginService({ email, password });

    res.cookie("accessToken", data.token, getAuthCookieOptions());

    return successResponse(res, data, "Login successful");
  } catch (error) {
    next(error);
  }
};

export const meController = async (req, res, next) => {
  try {
    const user = await getMeService(req.user.id);
    return successResponse(res, user, "User fetched");
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/"
    });

    return successResponse(res, null, "Logout successful");
  } catch (error) {
    next(error);
  }
};

export const promoteUserToAdminController = async (req, res, next) => {
  try {
    const updatedUser = await promoteUserToAdminService(req.params.userId);
    return successResponse(res, updatedUser, "User promoted to admin");
  } catch (error) {
    next(error);
  }
};