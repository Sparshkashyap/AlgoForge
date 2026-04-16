import express from "express";
import {
  getAdminStatsController,
  listUsersForAdminController,
  updateUserRoleController,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

import { getAdminAnalyticsController } from "../controllers/admin.controller.js";



const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/stats", getAdminStatsController);
router.get("/users", listUsersForAdminController);
router.patch("/users/:userId/role", updateUserRoleController);
router.get("/analytics", getAdminAnalyticsController);

export default router;