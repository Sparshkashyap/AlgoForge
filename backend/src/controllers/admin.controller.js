import {
  getAdminStatsService,
  listUsersForAdminService,
  updateUserRoleService,
} from "../services/adminUser.service.js";

import { getAdminAnalyticsService } from "../services/analytics.service.js";

export const listUsersForAdminController = async (_req, res, next) => {
  try {
    const users = await listUsersForAdminService();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleController = async (req, res, next) => {
  try {
    const user = await updateUserRoleService({
      userId: req.params.userId,
      role: req.body.role,
    });

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStatsController = async (_req, res, next) => {
  try {
    const stats = await getAdminStatsService();

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};



export const getAdminAnalyticsController = async (_req, res, next) => {
  try {
    const analytics = await getAdminAnalyticsService();

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};



