import express from "express";
import {
  getAdminStatsController,
  listUsersForAdminController,
  updateUserRoleController,
  getAdminAnalyticsController,
  blockUserController,
  unblockUserController,
  deleteUserController,
  listAuditLogsController,
  listSuspiciousLoginsController,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  adminUserIdParamSchema,
  blockUserSchema,
  updateUserRoleSchema,
} from "../validations/admin.validation.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/stats", getAdminStatsController);
router.get("/analytics", getAdminAnalyticsController);
router.get("/users", listUsersForAdminController);
router.get("/audit-logs", listAuditLogsController);
router.get("/suspicious-logins", listSuspiciousLoginsController);

router.patch(
  "/users/:userId/role",
  validate(updateUserRoleSchema),
  updateUserRoleController
);

router.patch(
  "/users/:userId/block",
  validate(blockUserSchema),
  blockUserController
);

router.patch(
  "/users/:userId/unblock",
  validate(adminUserIdParamSchema),
  unblockUserController
);

router.delete(
  "/users/:userId",
  validate(adminUserIdParamSchema),
  deleteUserController
);

export default router;