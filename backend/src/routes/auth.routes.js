import express from "express";
import passport from "passport";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  loginController,
  logoutController,
  meController,
  oauthSuccessController,
  requestPasswordResetController,
  resetPasswordController,
  requestPasswordResetOtpController,
  verifyPasswordResetOtpController,
  resetPasswordWithOtpVerificationController,
  signupController,
} from "../controllers/auth.controller.js";
import {
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  requestPasswordResetOtpSchema,
  verifyPasswordResetOtpSchema,
  resetPasswordWithOtpVerificationSchema,
  signupSchema,
} from "../validations/auth.validation.js";
import env from "../config/env.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);
router.post("/logout", logoutController);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${env.CLIENT_URL}/login?oauth=failed`,
  }),
  oauthSuccessController
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${env.CLIENT_URL}/login?oauth=failed`,
  }),
  oauthSuccessController
);

router.post(
  "/forgot-password",
  validate(requestPasswordResetSchema),
  requestPasswordResetController
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController
);

router.post(
  "/forgot-password-otp",
  validate(requestPasswordResetOtpSchema),
  requestPasswordResetOtpController
);

router.post(
  "/verify-reset-otp",
  validate(verifyPasswordResetOtpSchema),
  verifyPasswordResetOtpController
);

router.post(
  "/reset-password-with-otp",
  validate(resetPasswordWithOtpVerificationSchema),
  resetPasswordWithOtpVerificationController
);

router.get("/me", authMiddleware, meController);

export default router;