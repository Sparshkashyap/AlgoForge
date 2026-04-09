import express from "express";
import {
  signupController,
  loginController,
  meController,
  logoutController,
  promoteUserToAdminController
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { signupSchema, loginSchema } from "../validations/auth.validation.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signupController);
router.post("/login", validate(loginSchema), loginController);
router.post("/logout", logoutController);
router.get("/me", authMiddleware, meController);

router.patch(
  "/promote/:userId",
  authMiddleware,
  adminMiddleware,
  promoteUserToAdminController
);

// OAuth placeholders
router.get("/google", (req, res) => {
  res.status(501).json({
    success: false,
    message: "Google OAuth not implemented yet. Add passport/google oauth flow next."
  });
});

router.get("/github", (req, res) => {
  res.status(501).json({
    success: false,
    message: "GitHub OAuth not implemented yet. Add passport/github oauth flow next."
  });
});

export default router;