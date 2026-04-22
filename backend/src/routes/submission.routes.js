import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createSubmissionController,
  getSubmissionByIdForUserController,
  listMySubmissionsController,
} from "../controllers/submission.controller.js";
import { getMySubmissionAnalyticsController } from "../controllers/submission.analytics.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", listMySubmissionsController);
router.get("/analytics/me", getMySubmissionAnalyticsController);
router.get("/:submissionId", getSubmissionByIdForUserController);
router.post("/", createSubmissionController);

export default router;