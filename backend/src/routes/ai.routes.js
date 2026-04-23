import express from "express";
import {
  askAiAssistantController,
  generateHintController,
  generateProblemCodePackController,
  reviewCodeController,
  explainCodeController,
} from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkAiAccess } from "../middleware/checkSubscription.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/generate-problem-code-pack", generateProblemCodePackController);
router.post("/hint", generateHintController);
router.post("/review", reviewCodeController);
router.post("/explain", explainCodeController);
router.post("/ai-chat", checkAiAccess, askAiAssistantController);

export default router;