import express from "express";
import {
  blockUserController,
  getAdminDashboardSummaryController,
  listAuditLogsController,
  listUsersForAdminController,
  unblockUserController,
  updateUserRoleController,
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

// summary
router.get("/summary", getAdminDashboardSummaryController);

// users
router.get("/users", listUsersForAdminController);

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

// audit
router.get("/audit-logs", listAuditLogsController);

export default router;