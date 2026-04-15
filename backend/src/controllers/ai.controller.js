import {
  generateHintService,
  generateProblemCodePackService,
} from "../services/ai.service.js";

export const generateHintController = async (req, res, next) => {
  try {
    const result = await generateHintService(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const generateProblemCodePackController = async (req, res, next) => {
  try {
    const result = await generateProblemCodePackService(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};