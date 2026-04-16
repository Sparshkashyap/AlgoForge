import {
  getDailyQuestionService,
  markDailyQuestionAttemptService,
} from "../services/dailyQuestion.service.js";

export const getDailyQuestionController = async (req, res, next) => {
  try {
    const data = await getDailyQuestionService(req.user?.userId || null);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const markDailyQuestionAttemptController = async (req, res, next) => {
  try {
    const result = await markDailyQuestionAttemptService({
      userId: req.user.userId,
      dailyQuestionId: req.body.dailyQuestionId,
      status: req.body.status,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};