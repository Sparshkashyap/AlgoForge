import express from "express";
import {
  createProblemController,
  deleteProblemController,
  getProblemByIdForAdminController,
  getProblemBySlugController,
  listAdminProblemsController,
  listPublishedProblemsController,
  previewProblemRunController,
  updateProblemController,
} from "../controllers/problem.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { creatorOrAdminMiddleware } from "../middleware/creatorOrAdmin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createProblemSchema,
  previewProblemRunSchema,
} from "../validations/problem.validation.js";

const router = express.Router();

router.get("/", listPublishedProblemsController);
router.get("/admin/all/list", authMiddleware, adminMiddleware, listAdminProblemsController);
router.get("/admin/:problemId", authMiddleware, adminMiddleware, getProblemByIdForAdminController);
router.get("/:slug", getProblemBySlugController);

router.post(
  "/preview-run",
  authMiddleware,
  creatorOrAdminMiddleware,
  validate(previewProblemRunSchema),
  previewProblemRunController
);

router.post(
  "/",
  authMiddleware,
  creatorOrAdminMiddleware,
  validate(createProblemSchema),
  createProblemController
);

router.put(
  "/:problemId",
  authMiddleware,
  creatorOrAdminMiddleware,
  validate(createProblemSchema),
  updateProblemController
);

router.delete(
  "/:problemId",
  authMiddleware,
  creatorOrAdminMiddleware,
  deleteProblemController
);

export default router;