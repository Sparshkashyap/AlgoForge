import { signupService, loginService } from "../services/auth.service.js";
import {
  requestPasswordResetOtpService,
  verifyPasswordResetOtpService,
  resetPasswordWithOtpVerificationService,
  requestPasswordResetService,
  resetPasswordService,
} from "../services/passwordReset.service.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookies.js";
import { signToken } from "../utils/jwt.js";
import env from "../config/env.js";
import { createAuditLogService } from "../services/audit.service.js";

export const signupController = async (req, res, next) => {
  try {
    const { user, token } = await signupService({
      ...req.validated.body,
      remoteIp: req.ip,
    });

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
    const { user, token } = await loginService({
      ...req.validated.body,
      remoteIp: req.ip,
      userAgent: req.get("user-agent") || null,
    });

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
      return res.redirect(`${env.CLIENT_URL}/login?oauth=failed`);
    }

    const token = signToken({
      userId: req.user.id,
      email: req.user.email,
      role: req.user.role,
    });

    setAuthCookie(res, token);

    return res.redirect(`${env.CLIENT_URL}/dashboard`);
  } catch (error) {
    next(error);
  }
};

export const requestPasswordResetOtpController = async (req, res, next) => {
  try {
    const result = await requestPasswordResetOtpService({
      ...req.validated.body,
      remoteIp: req.ip,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyPasswordResetOtpController = async (req, res, next) => {
  try {
    const result = await verifyPasswordResetOtpService({
      ...req.validated.body,
      remoteIp: req.ip,
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordWithOtpVerificationController = async (
  req,
  res,
  next
) => {
  try {
    const result = await resetPasswordWithOtpVerificationService(
      req.validated.body
    );

    await createAuditLogService({
      action: "PASSWORD_RESET_COMPLETED",
      actorUserId: null,
      targetUserId: null,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null,
      metadata: {
        method: "OTP_VERIFIED_RESET",
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const requestPasswordResetController = async (req, res, next) => {
  try {
    const result = await requestPasswordResetService(req.validated.body);

    await createAuditLogService({
      action: "PASSWORD_RESET_REQUESTED",
      actorUserId: null,
      targetUserId: null,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null,
      metadata: {
        email: req.validated.body.email,
        method: "LINK_OR_LEGACY_FLOW",
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const result = await resetPasswordService(req.validated.body);

    await createAuditLogService({
      action: "PASSWORD_RESET_COMPLETED",
      actorUserId: null,
      targetUserId: null,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null,
      metadata: {
        method: "TOKEN_RESET",
      },
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const meController = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};

export const logoutController = async (_req, res) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};