import express from "express";
import {
  listProblemsController,
  getProblemBySlugController,
  createProblemController
} from "../controllers/problem.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { createProblemSchema } from "../validations/problem.validation.js";

const router = express.Router();

router.get("/", listProblemsController);
router.get("/:slug", getProblemBySlugController);
router.post("/", validate(createProblemSchema), createProblemController);

export default router;