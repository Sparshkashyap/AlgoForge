import express from "express";
import {
  approveProblemController,
  listProblemsForReviewController,
  rejectProblemController,
} from "../controllers/problem.review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", listProblemsForReviewController);
router.patch("/:problemId/approve", approveProblemController);
router.patch("/:problemId/reject", rejectProblemController);

export default router;