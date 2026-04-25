import express from "express";
import {
  blockUserController,
  getAdminDashboardSummaryController,
  getPricingCatalogController,
  listAuditLogsController,
  listUsersForAdminController,
  unblockUserController,
  updatePricingCatalogController,
  updateUserRoleController,
} from "../controllers/admin.controller.js";
import { getRevenueAnalyticsController } from "../controllers/admin.analytics.controller.js";
import { getSalesChartController } from "../controllers/admin.sales.controller.js";
import { listAllSubscriptionsForAdminController } from "../controllers/admin.billing.controller.js";
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

router.get("/summary", getAdminDashboardSummaryController);

router.get("/users", listUsersForAdminController);

router.get("/analytics/revenue", getRevenueAnalyticsController);
router.get("/analytics/sales-chart", getSalesChartController);

// ✅ FIX: admin subscriptions route
router.get("/billing/subscriptions", listAllSubscriptionsForAdminController);

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

router.get("/audit-logs", listAuditLogsController);

router.get("/pricing", getPricingCatalogController);
router.put("/pricing", updatePricingCatalogController);

export default router;