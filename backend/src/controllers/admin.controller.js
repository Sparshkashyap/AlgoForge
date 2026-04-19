import {
  getAdminStatsService,
  listUsersForAdminService,
  updateUserRoleService,
  blockUserService,
  unblockUserService,
  deleteUserService,
} from "../services/adminUser.service.js";
import { getAdminAnalyticsService } from "../services/analytics.service.js";
import {
  listAuditLogsService,
  listSuspiciousLoginEventsService,
} from "../services/audit.service.js";

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
      actorUserId: req.user.userId,
      userId: req.params.userId,
      role: req.validated.body.role,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null,
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

export const blockUserController = async (req, res, next) => {
  try {
    const user = await blockUserService({
      actorUserId: req.user.userId,
      userId: req.params.userId,
      reason: req.validated.body.reason,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null,
    });

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const unblockUserController = async (req, res, next) => {
  try {
    const user = await unblockUserService({
      actorUserId: req.user.userId,
      userId: req.params.userId,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null,
    });

    return res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (req, res, next) => {
  try {
    const result = await deleteUserService({
      actorUserId: req.user.userId,
      userId: req.params.userId,
      ipAddress: req.ip,
      userAgent: req.get("user-agent") || null,
    });

    return res.status(200).json(result);
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

export const listAuditLogsController = async (_req, res, next) => {
  try {
    const logs = await listAuditLogsService();

    return res.status(200).json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const listSuspiciousLoginsController = async (_req, res, next) => {
  try {
    const events = await listSuspiciousLoginEventsService();

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};