import { askRagChatService } from "../services/ragChat.service.js";

export const askRagChatController = async (req, res, next) => {
  try {
    const data = await askRagChatService({
      question: req.body.question,
      context: req.body.context,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};