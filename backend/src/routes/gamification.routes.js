import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getMyGamificationSummaryController } from "../controllers/gamification.controller.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/me", getMyGamificationSummaryController);

export default router;