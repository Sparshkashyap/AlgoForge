import { getMyGamificationSummaryService } from "../services/gamification.service.js";

export const getMyGamificationSummaryController = async (req, res, next) => {
  try {
    const data = await getMyGamificationSummaryService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};