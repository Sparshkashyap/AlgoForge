import express from "express";
import {
  getMyProblemNoteController,
  saveMyProblemNoteController,
} from "../controllers/problemNote.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:problemId", getMyProblemNoteController);
router.put("/:problemId", saveMyProblemNoteController);

export default router;