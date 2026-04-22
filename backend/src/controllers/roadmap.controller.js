import { getRoadmapService } from "../services/roadmap.service.js";

export const getRoadmapController = async (req, res, next) => {
  try {
    const userId = req.user?.userId || null;
    const data = await getRoadmapService(userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};