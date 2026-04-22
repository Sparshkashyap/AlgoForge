import { getGlobalLeaderboardService } from "../services/leaderboard.service.js";

export const getGlobalLeaderboardController = async (_req, res, next) => {
  try {
    const data = await getGlobalLeaderboardService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};  