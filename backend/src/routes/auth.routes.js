import express from "express";
import passport from "passport";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginController,
  logoutController,
  oauthSuccessController,
  requestPasswordResetController,
  resetPasswordController,
  signupController,
} from "../controllers/auth.controller.js";
import {
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  signupSchema,
} from "../validations/auth.validation.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

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
    failureRedirect: `${process.env.CLIENT_URL}/login?oauth=failed`,
  }),
  oauthSuccessController
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?oauth=failed`,
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

router.get("/me", authMiddleware, async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

export default router;