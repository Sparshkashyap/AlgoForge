import express from "express";
import {
  createSubmissionController,
  listMySubmissionsController,
} from "../controllers/submission.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createSubmissionSchema } from "../validations/submission.validation.js";

const router = express.Router();

router.post("/", authMiddleware, validate(createSubmissionSchema), createSubmissionController);
router.get("/me", authMiddleware, listMySubmissionsController);

export default router;