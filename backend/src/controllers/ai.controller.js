import {
  generateHintService,
  generateProblemCodePackService,
  reviewCodeService,
} from "../services/ai.service.js";
import { assertPremiumAccess } from "../services/featureGate.service.js";

export const generateProblemCodePackController = async (req, res, next) => {
  try {
    if (!["ADMIN", "CREATOR"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Creator or admin access required",
      });
    }

    const result = await generateProblemCodePackService({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const generateHintController = async (req, res, next) => {
  try {
    assertPremiumAccess(req.user, "AI Hint");

    const result = await generateHintService({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const reviewCodeController = async (req, res, next) => {
  try {
    assertPremiumAccess(req.user, "AI Code Review");

    const result = await reviewCodeService({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};