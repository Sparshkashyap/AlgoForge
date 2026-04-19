import express from "express";
import {
  createSubmissionController,
  getSubmissionStatusController,
  listMySubmissionsController,
} from "../controllers/submission.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createSubmissionSchema } from "../validations/submission.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createSubmissionSchema), createSubmissionController);
router.get("/me", listMySubmissionsController);
router.get("/:submissionId", getSubmissionStatusController);

export default router;