import { getMySubmissionAnalyticsService } from "../services/submission.analytics.service.js";

export const getMySubmissionAnalyticsController = async (req, res, next) => {
  try {
    const data = await getMySubmissionAnalyticsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};