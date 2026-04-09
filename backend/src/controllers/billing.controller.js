import { createOrderService } from "../services/billing.service.js";
import { successResponse } from "../utils/response.js";

export const createOrderController = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const order = await createOrderService({
      amount,
      receipt: `receipt_${Date.now()}`
    });

    return successResponse(res, order, "Razorpay order created", 201);
  } catch (error) {
    next(error);
  }
};