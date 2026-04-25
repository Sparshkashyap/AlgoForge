import express from "express";
import {
  approveProblemController,
  listProblemsForReviewController,
  rejectProblemController,
  submitProblemForReviewController,
} from "../controllers/problem.review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.patch("/:problemId/submit", submitProblemForReviewController);

router.get("/", adminMiddleware, listProblemsForReviewController);
router.patch("/:problemId/approve", adminMiddleware, approveProblemController);
router.patch("/:problemId/reject", adminMiddleware, rejectProblemController);

export default router;