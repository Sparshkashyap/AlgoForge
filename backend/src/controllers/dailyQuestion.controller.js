import {
  getMyDailyQuestionAttemptService,
  getTodayDailyQuestionService,
  markDailyQuestionAttemptService,
} from "../services/dailyQuestion.service.js";

export const getTodayDailyQuestionController = async (_req, res, next) => {
  try {
    const data = await getTodayDailyQuestionService();

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
    const data = await markDailyQuestionAttemptService({
      userId: req.user.userId,
      dailyQuestionId: req.validated?.body?.dailyQuestionId ?? req.body.dailyQuestionId,
      status: req.validated?.body?.status ?? req.body.status,
    });

    return res.status(200).json({
      success: true,
      message: "Daily question attempt saved",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyDailyQuestionAttemptController = async (req, res, next) => {
  try {
    const data = await getMyDailyQuestionAttemptService({
      userId: req.user.userId,
      dailyQuestionId: req.params.dailyQuestionId,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};