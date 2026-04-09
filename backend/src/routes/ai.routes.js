import express from "express";
import { hintController } from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/hint", authMiddleware, hintController);

export default router;