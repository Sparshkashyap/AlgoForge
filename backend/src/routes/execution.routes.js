import express from "express";
import { runProblemCodeController } from "../controllers/execution.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { runProblemSchema } from "../validations/problem.validation.js";

const router = express.Router();

router.post("/:problemId/run", validate(runProblemSchema), runProblemCodeController);

export default router;