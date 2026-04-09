import express from "express";
import { dashboardController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, dashboardController);

export default router;