import { listAllSubscriptionsForAdminService } from "../services/admin.billing.service.js";

export const listAllSubscriptionsForAdminController = async (
  _req,
  res,
  next
) => {
  try {
    const data = await listAllSubscriptionsForAdminService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};