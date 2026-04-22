import { getRevenueAnalyticsService } from "../services/admin.analytics.service.js";

export const getRevenueAnalyticsController = async (_req, res, next) => {
  try {
    const data = await getRevenueAnalyticsService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};