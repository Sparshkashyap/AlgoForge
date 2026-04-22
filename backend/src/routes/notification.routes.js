import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMyNotificationsController,
  listMyNotificationsController,
  getMyNotificationSummaryController,
  markAllMyNotificationsReadController,
  markAllNotificationsReadController,
  markMyNotificationReadController,
  markNotificationReadController,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getMyNotificationsController ?? listMyNotificationsController);
router.get("/me/summary", getMyNotificationSummaryController);

// support both route styles to avoid breaking existing frontend/backends
router.patch(
  "/me/read-all",
  markAllMyNotificationsReadController ?? markAllNotificationsReadController
);
router.put(
  "/read-all",
  markAllNotificationsReadController ?? markAllMyNotificationsReadController
);

router.patch(
  "/me/:notificationId/read",
  markMyNotificationReadController ?? markNotificationReadController
);
router.put(
  "/:notificationId/read",
  markNotificationReadController ?? markMyNotificationReadController
);

export default router;