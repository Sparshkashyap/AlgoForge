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

router.get("/me/list", authMiddleware, creatorOrAdminMiddleware, listMyCreatedContestsController);

router.post(
  "/",
  authMiddleware,
  creatorOrAdminMiddleware,
  validate(createContestSchema),
  createContestController
);

router.put(
  "/:contestId",
  authMiddleware,
  creatorOrAdminMiddleware,
  validate(contestIdParamSchema),
  updateContestController
);

router.delete(
  "/:contestId",
  authMiddleware,
  creatorOrAdminMiddleware,
  validate(contestIdParamSchema),
  deleteContestController
);

router.post(
  "/:contestId/register",
  authMiddleware,
  validate(contestIdParamSchema),
  registerForContestController
);

export default router;

















































