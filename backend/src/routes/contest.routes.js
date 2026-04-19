import express from "express";
import {
  createContestController,
  getContestByIdController,
  listPublishedContestsController,
  registerForContestController,
} from "../controllers/contest.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { creatorOrAdminMiddleware } from "../middleware/creatorOrAdmin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  contestIdParamSchema,
  createContestSchema,
} from "../validations/contest.validation.js";

const router = express.Router();

router.get("/", listPublishedContestsController);
router.get("/:contestId", validate(contestIdParamSchema), getContestByIdController);

router.post(
  "/",
  authMiddleware,
  creatorOrAdminMiddleware,
  validate(createContestSchema),
  createContestController
);

router.post(
  "/:contestId/register",
  authMiddleware,
  validate(contestIdParamSchema),
  registerForContestController
);

export default router;