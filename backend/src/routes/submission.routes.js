import express from "express";
import {
  createSubmissionController,
  getSubmissionByIdForUserController,
  listMySubmissionsController,
} from "../controllers/submission.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createSubmissionSchema } from "../validations/submission.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validate(createSubmissionSchema), createSubmissionController);
router.get("/me", listMySubmissionsController);
router.get("/:submissionId", getSubmissionByIdForUserController);

export default router;










































