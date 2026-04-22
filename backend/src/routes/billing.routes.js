import express from "express";
import {
  cancelMySubscriptionController,
  createSubscriptionCheckoutController,
  getMyBillingController,
  getPublicPricingPlansController,
} from "../controllers/billing.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/plans", getPublicPricingPlansController);

router.use(authMiddleware);

router.get("/me", getMyBillingController);
router.post("/checkout", createSubscriptionCheckoutController);
router.post("/cancel", cancelMySubscriptionController);

export default router;