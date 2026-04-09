import { generateHintService } from "../services/ai.service.js";
import { successResponse } from "../utils/response.js";

export const hintController = async (req, res, next) => {
  try {
    const { title, description, code } = req.body;

    const result = await generateHintService({
      title,
      description,
      code
    });

    return successResponse(res, result, "AI hint generated");
  } catch (error) {
    next(error);
  }
};