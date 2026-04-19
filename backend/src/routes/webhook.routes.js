import express from "express";
import { razorpayWebhookController } from "../controllers/webhook.controller.js";

const router = express.Router();

// mounted at /api/webhooks/razorpay in app.js
router.post("/", razorpayWebhookController);

export default router;