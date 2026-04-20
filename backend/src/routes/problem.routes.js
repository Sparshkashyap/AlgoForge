import express from "express";
import {
  createProblemController,
  deleteProblemController,
  getProblemByIdForAdminController,
  getProblemBySlugController,
  listAdminProblemsController,
  listProblemsController,
  listMyProblemsController,
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

/**
 * IMPORTANT:
 * static routes before dynamic routes
 */

// public
router.get("/", listProblemsController);

router.get(
  "/admin/all/list",
  authMiddleware,
  adminMiddleware,
  listAdminProblemsController
);

router.get(
  "/admin/:problemId",
  authMiddleware,
  adminMiddleware,
  getProblemByIdForAdminController
);

router.get("/me", authMiddleware, listMyProblemsController);

// preview run
router.post(
  "/preview-run",
  authMiddleware,
  creatorOrAdminMiddleware,
  validate(previewProblemRunSchema),
  previewProblemRunController
);

// protected creator/admin routes
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

// dynamic slug route always last
router.get("/:slug", getProblemBySlugController);

export default router;