import {
  blockUserService,
  getAdminDashboardSummaryService,
  listAuditLogsService,
  listUsersForAdminService,
  unblockUserService,
  updateUserRoleService,
} from "../services/admin.service.js";

export const getAdminDashboardSummaryController = async (_req, res, next) => {
  try {
    const data = await getAdminDashboardSummaryService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const listUsersForAdminController = async (_req, res, next) => {
  try {
    const data = await listUsersForAdminService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleController = async (req, res, next) => {
  try {
    const data = await updateUserRoleService({
      actorUserId: req.user.userId,
      targetUserId: req.validated?.params?.userId ?? req.params.userId,
      role: req.validated?.body?.role ?? req.body.role,
    });

    return res.status(200).json({
      success: true,
      message: "User role updated",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const blockUserController = async (req, res, next) => {
  try {
    const data = await blockUserService({
      actorUserId: req.user.userId,
      targetUserId: req.validated?.params?.userId ?? req.params.userId,
      reason: req.validated?.body?.reason ?? req.body.reason,
    });

    return res.status(200).json({
      success: true,
      message: "User blocked",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const unblockUserController = async (req, res, next) => {
  try {
    const data = await unblockUserService({
      actorUserId: req.user.userId,
      targetUserId: req.validated?.params?.userId ?? req.params.userId,
    });

    return res.status(200).json({
      success: true,
      message: "User unblocked",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const listAuditLogsController = async (_req, res, next) => {
  try {
    const data = await listAuditLogsService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};