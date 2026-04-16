import express from "express";
import {
  exportProblemsCsvController,
  exportUsersCsvController,
} from "../controllers/export.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/users.csv", exportUsersCsvController);
router.get("/problems.csv", exportProblemsCsvController);

export default router;