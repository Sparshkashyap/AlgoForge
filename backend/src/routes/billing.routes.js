import express from "express";
import { createOrderController } from "../controllers/billing.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createOrderController);

export default router;