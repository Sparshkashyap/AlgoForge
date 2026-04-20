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

router.get("/users.csv", exportUsersController);
router.get("/submissions.csv", exportSubmissionsController);
router.get("/problems.csv", exportProblemsController);

export default router;