import express from "express";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../controllers/subscription.controller.js";

import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getAllPlans);

router.post("/", authMiddleware, isAdmin, createPlan);
router.put("/:id", authMiddleware, isAdmin, updatePlan);
router.delete("/:id", authMiddleware, isAdmin, deletePlan);

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify", authMiddleware, verifyPayment);

export default router;