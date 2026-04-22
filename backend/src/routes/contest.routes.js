import express from "express";
import {
  createContestController,
  deleteContestController,
  getContestByIdController,
  listMyCreatedContestsController,
  listPublishedContestsController,
  registerForContestController,
  updateContestController,
} from "../controllers/contest.controller.js";
import { getContestRankingController } from "../controllers/contest.ranking.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { creatorOrAdminMiddleware } from "../middleware/creatorOrAdmin.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  contestIdParamSchema,
  createContestSchema,
} from "../validations/contest.validation.js";

const router = express.Router();

/**
 * IMPORTANT:
 * static routes must come before dynamic :contestId route
 * otherwise /me/list becomes contestId="me"
 */

// public
router.get("/", listPublishedContestsController);
router.get("/me/list", authMiddleware, adminMiddleware, listMyCreatedContestsController);
router.get("/:contestId/ranking", validate(contestIdParamSchema), getContestRankingController);
router.get("/:contestId", validate(contestIdParamSchema), getContestByIdController);

// protected admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validate(createContestSchema),
  createContestController
);

router.put(
  "/:contestId",
  authMiddleware,
  adminMiddleware,
  validate(contestIdParamSchema),
  updateContestController
);

router.delete(
  "/:contestId",
  authMiddleware,
  adminMiddleware,
  validate(contestIdParamSchema),
  deleteContestController
);

// user registration
router.post(
  "/:contestId/register",
  authMiddleware,
  validate(contestIdParamSchema),
  registerForContestController
);

export default router;