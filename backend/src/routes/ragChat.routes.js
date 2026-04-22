import express from "express";
import { askRagChatController } from "../controllers/ragChat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/ask", askRagChatController);

export default router;