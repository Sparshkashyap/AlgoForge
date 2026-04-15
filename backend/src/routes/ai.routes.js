import express from "express";
import {
  generateHintController,
  generateProblemCodePackController,
} from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.post("/hint", authMiddleware, generateHintController);
router.post(
  "/generate-problem-code-pack",
  authMiddleware,
  adminMiddleware,
  generateProblemCodePackController
);

export default router;