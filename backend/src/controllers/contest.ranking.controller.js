import { getContestRankingService } from "../services/contest.ranking.service.js";

export const getContestRankingController = async (req, res, next) => {
  try {
    const data = await getContestRankingService(req.params.contestId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};