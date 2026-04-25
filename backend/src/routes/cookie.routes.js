import express from "express";
import { saveCookieConsent } from "../controllers/cookie.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// public + optional auth
router.post("/", (req, res, next) => {
  // try attach user but don't fail if not logged in
  authMiddleware(req, res, () => saveCookieConsent(req, res, next));
});

export default router;