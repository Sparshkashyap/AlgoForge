import express from "express";
import { getRoadmapController } from "../controllers/roadmap.controller.js";
import { optionalAuthMiddleware } from "../middleware/optionalAuth.middleware.js";

const router = express.Router();

router.get("/", optionalAuthMiddleware, getRoadmapController);

export default router;