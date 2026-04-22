import express from "express";
import {
  createDiscussionReplyController,
  createProblemDiscussionController,
  listProblemDiscussionsController,
} from "../controllers/discussion.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/problem/:problemId", listProblemDiscussionsController);
router.post("/problem/:problemId", authMiddleware, createProblemDiscussionController);
router.post("/reply/:discussionId", authMiddleware, createDiscussionReplyController);

export default router;