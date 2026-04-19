import {
  getActiveDailyQuestionService,
  markDailyQuestionAttemptService,
} from "../services/dailyQuestion.service.js";

export const getActiveDailyQuestionController = async (_req, res, next) => {
  try {
    const dailyQuestion = await getActiveDailyQuestionService();

    return res.status(200).json({
      success: true,
      data: dailyQuestion,
    });
  } catch (error) {
    next(error);
  }
};

export const markDailyQuestionAttemptController = async (req, res, next) => {
  try {
    const attempt = await markDailyQuestionAttemptService({
      userId: req.user.userId,
      dailyQuestionId: req.validated.body.dailyQuestionId,
      status: req.validated.body.status,
    });

    return res.status(200).json({
      success: true,
      message: "Daily question attempt saved",
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};