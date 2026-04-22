import { getMyHeatmapService } from "../services/heatmap.service.js";

export const getMyHeatmapController = async (req, res, next) => {
  try {
    const days = Number(req.query.days || 365);
    const safeDays = Number.isFinite(days) ? Math.min(Math.max(days, 30), 365) : 365;

    const data = await getMyHeatmapService(req.user.userId, safeDays);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};