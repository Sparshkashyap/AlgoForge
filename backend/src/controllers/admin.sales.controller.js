import { getSalesChartService } from "../services/admin.sales.service.js";

export const getSalesChartController = async (_req, res, next) => {
  try {
    const data = await getSalesChartService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};