import express from "express";
import {
  cancelMySubscriptionController,
  createSubscriptionCheckoutController,
  getMyBillingController,
} from "../controllers/billing.controller.js";
import { razorpayWebhookController } from "../controllers/webhook.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// public webhook route
router.post("/webhook", razorpayWebhookController);

// protected billing routes
router.use(authMiddleware);

router.get("/me", getMyBillingController);
router.post("/checkout", createSubscriptionCheckoutController);
router.post("/cancel", cancelMySubscriptionController);

export default router;