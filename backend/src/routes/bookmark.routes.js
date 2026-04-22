import express from "express";
import {
  listMyBookmarksController,
  toggleBookmarkController,
} from "../controllers/bookmark.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/me", listMyBookmarksController);
router.post("/:problemId/toggle", toggleBookmarkController);

export default router;