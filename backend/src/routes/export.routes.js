import express from "express";
import {
  exportProblemsController,
  exportSubmissionsController,
  exportUsersController,
} from "../controllers/export.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users", exportUsersController);
router.get("/submissions", exportSubmissionsController);
router.get("/problems", exportProblemsController);

export default router;