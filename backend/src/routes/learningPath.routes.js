import express from "express";
import {
  createLearningPathController,
  getLearningPathByIdController,
  listLearningPathsController,
} from "../controllers/learningPath.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.get("/", listLearningPathsController);
router.get("/:pathId", getLearningPathByIdController);

router.post("/", authMiddleware, adminMiddleware, createLearningPathController);

export default router;