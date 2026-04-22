import { askAiAssistantService } from "../services/ai.orchestrator.service.js";
import {
  basicAiExplainService,
  generateHintService,
  generateProblemCodePackService,
  reviewCodeService,
} from "../services/ai.service.js";
import { assertPremiumAccess } from "../services/featureGate.service.js";

export const askAiAssistantController = async (req, res, next) => {
  try {
    const body = req.validated?.body ?? req.body;
    const message = String(body.message || "").trim();

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    const data = await askAiAssistantService({
      message,
      userId: req.user.userId,
      role: req.user.role,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

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
      ...(req.validated?.body ?? req.body),
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
      ...(req.validated?.body ?? req.body),
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
      ...(req.validated?.body ?? req.body),
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const explainCodeController = async (req, res, next) => {
  try {
    const { code, language } = req.validated?.body ?? req.body;

    const result = await basicAiExplainService({
      userId: req.user?.userId,
      code,
      language,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};