import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  getMyDailyQuestionAttemptController,
  getTodayDailyQuestionController,
  markDailyQuestionAttemptController,
} from "../controllers/dailyQuestion.controller.js";
import { z } from "zod";

const router = express.Router();

const markDailyAttemptSchema = z.object({
  body: z.object({
    dailyQuestionId: z.string().min(1, "dailyQuestionId is required"),
    status: z.string().min(1, "status is required"),
  }),
  params: z.object({}),
  query: z.object({}),
});

router.get("/today", getTodayDailyQuestionController);

router.get(
  "/attempt/:dailyQuestionId",
  authMiddleware,
  getMyDailyQuestionAttemptController
);

router.post(
  "/attempt",
  authMiddleware,
  validate(markDailyAttemptSchema),
  markDailyQuestionAttemptController
);

export default router;