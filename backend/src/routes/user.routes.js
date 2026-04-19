import express from "express";
import {
  getMyProfileController,
  updateMyProfileController,
  uploadAvatarController,
  getMySolveStatsController,
  getMyNotificationsController,
  getMyNotificationSummaryController,
  readMyNotificationController,
  readAllMyNotificationsController,
  getMyBadgesController,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  notificationIdParamSchema,
  readAllNotificationsSchema,
} from "../validations/user.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", getMyProfileController);
router.patch("/me", updateMyProfileController);
router.post("/me/avatar", upload.single("avatar"), uploadAvatarController);

router.get("/me/solve-stats", getMySolveStatsController);
router.get("/me/badges", getMyBadgesController);

router.get("/me/notifications", getMyNotificationsController);
router.get("/me/notifications/summary", getMyNotificationSummaryController);

router.patch(
  "/me/notifications/:notificationId/read",
  validate(notificationIdParamSchema),
  readMyNotificationController
);

router.patch(
  "/me/notifications/read-all",
  validate(readAllNotificationsSchema),
  readAllMyNotificationsController
);

export default router;