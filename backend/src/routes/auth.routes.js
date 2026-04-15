import express from "express";
import { login, logout, me, signup } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, signupSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

export default router;