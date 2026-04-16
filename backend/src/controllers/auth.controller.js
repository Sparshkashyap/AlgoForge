import { signupService, loginService } from "../services/auth.service.js";
import {
  requestPasswordResetService,
  resetPasswordService,
} from "../services/passwordReset.service.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { signToken } from "../utils/jwt.js";

export const signupController = async (req, res, next) => {
  try {
    const { user, token } = await signupService(req.validated.body);

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { user, token } = await loginService(req.validated.body);

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const oauthSuccessController = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?oauth=failed`);
    }

    const token = signToken({
      userId: req.user.id,
      email: req.user.email,
      role: req.user.role,
    });

    setAuthCookie(res, token);

    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    next(error);
  }
};

export const requestPasswordResetController = async (req, res, next) => {
  try {
    const result = await requestPasswordResetService(req.validated.body.email);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const result = await resetPasswordService(req.validated.body);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (_req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};