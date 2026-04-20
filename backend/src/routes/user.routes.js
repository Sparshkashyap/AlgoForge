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
import { validate } from "../middleware/validate.middleware.js";
import { z } from "zod";

const router = express.Router();

router.use(authMiddleware);

const notificationIdParamSchema = z.object({
  params: z.object({
    notificationId: z.string().min(1, "notificationId is required"),
  }),
  body: z.object({}),
  query: z.object({}),
});

router.get("/me", getMyProfileController);
router.put("/me", updateMyProfileController);

router.post("/avatar", uploadAvatarController);

router.get("/stats", getMySolveStatsController);

router.get("/notifications", getMyNotificationsController);
router.get("/notifications/summary", getMyNotificationSummaryController);

router.patch(
  "/notifications/:notificationId/read",
  validate(notificationIdParamSchema),
  readMyNotificationController
);

router.patch("/notifications/read-all", readAllMyNotificationsController);

router.get("/badges", getMyBadgesController);

export default router;