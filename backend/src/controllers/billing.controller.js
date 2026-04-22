import {
  cancelMySubscriptionService,
  createSubscriptionCheckoutService,
  getMyBillingService,
} from "../services/billing.service.js";
import { getVisiblePricingPlansForRoleService } from "../services/plan.service.js";

export const getPublicPricingPlansController = async (req, res, next) => {
  try {
    const role = req.user?.role || "USER";
    const data = await getVisiblePricingPlansForRoleService(role);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createSubscriptionCheckoutController = async (req, res, next) => {
  try {
    const result = await createSubscriptionCheckoutService({
      userId: req.user.userId,
      tier: req.body.tier,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBillingController = async (req, res, next) => {
  try {
    const result = await getMyBillingService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelMySubscriptionController = async (req, res, next) => {
  try {
    const result = await cancelMySubscriptionService(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Subscription cancellation requested",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};