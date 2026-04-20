import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  listMyNotificationsController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", listMyNotificationsController);
router.put("/read-all", markAllNotificationsReadController);
router.put("/:notificationId/read", markNotificationReadController);

export default router;