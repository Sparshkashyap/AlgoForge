import express from "express";
import {
  getDailyQuestionController,
  markDailyQuestionAttemptController,
} from "../controllers/dailyQuestion.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getDailyQuestionController);
router.post("/attempt", authMiddleware, markDailyQuestionAttemptController);

export default router;