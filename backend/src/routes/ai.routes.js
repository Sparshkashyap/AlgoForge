import express from "express";
import {
  generateHintController,
  generateProblemCodePackController,
  reviewCodeController,
} from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { explainCodeController } from "../controllers/ai.controller.js";
import { askAiAssistantController } from "../controllers/ai.controller.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/generate-problem-code-pack", generateProblemCodePackController);
router.post("/hint", generateHintController);
router.post("/review", reviewCodeController);
router.post("/explain", explainCodeController);
router.post("/chat", askAiAssistantController);
export default router;