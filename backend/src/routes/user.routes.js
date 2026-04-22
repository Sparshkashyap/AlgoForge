import express from "express";
import { z } from "zod";
import {
  getMyProfileController,
  getMeController,
  updateMyProfileController,
  updateMeController,
  uploadAvatarController,
  removeMyAvatarController,
  getMySolveStatsController,
  getMyNotificationsController,
  getMyNotificationSummaryController,
  readMyNotificationController,
  readAllMyNotificationsController,
  getMyBadgesController,
  updateUserAvatarController,
  updateUserAvatarByAdminController,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { getMyGamificationSummaryController } from "../controllers/gamification.controller.js";
import { getMyHeatmapController } from "../controllers/heatmap.controller.js";

const router = express.Router();

const notificationIdParamSchema = z.object({
  params: z.object({
    notificationId: z.string().min(1, "notificationId is required"),
  }),
  body: z.object({}),
  query: z.object({}),
});

router.use(authMiddleware);

// profile
router.get("/me", getMyProfileController ?? getMeController);
router.put("/me", updateMyProfileController ?? updateMeController);
router.patch("/me", updateMeController ?? updateMyProfileController);
router.post("/avatar", uploadAvatarController);
router.delete("/me/avatar", removeMyAvatarController);

// stats / badges
router.get("/stats", getMySolveStatsController);
router.get("/badges", getMyBadgesController);

// notifications
router.get("/notifications", getMyNotificationsController);
router.get("/notifications/summary", getMyNotificationSummaryController);
router.patch(
  "/notifications/:notificationId/read",
  validate(notificationIdParamSchema),
  readMyNotificationController
);
router.patch("/notifications/read-all", readAllMyNotificationsController);

// gamification
router.get("/gamification/me", getMyGamificationSummaryController);

// heatmap
router.get("/heatmap/me", getMyHeatmapController);

// admin avatar control for other users
router.patch(
  "/admin/:userId/avatar",
  adminMiddleware,
  updateUserAvatarByAdminController ?? updateUserAvatarController
);

export default router;