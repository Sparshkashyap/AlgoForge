import {
  blockUserService,
  getAdminDashboardSummaryService,
  listAuditLogsService,
  listUsersForAdminService,
  unblockUserService,
  updateUserRoleService,
} from "../services/admin.service.js";
import {
  getPricingCatalogService,
  updatePricingCatalogService,
} from "../services/plan.service.js";
import prisma from "../config/db.js";

export const getAdminDashboardSummaryController = async (_req, res, next) => {
  try {
    const summary = await getAdminDashboardSummaryService();

    const [sales] = await prisma.$transaction([
      prisma.user.aggregate({
        _count: {
          id: true,
        },
        where: {
          plan: {
            in: ["STANDARD", "PRO"],
          },
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        ...summary,
        totalPaidUsers: sales?._count?.id || 0,
      },
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

export const getPricingCatalogController = async (_req, res, next) => {
  try {
    const data = await getPricingCatalogService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePricingCatalogController = async (req, res, next) => {
  try {
    const data = await updatePricingCatalogService({
      actorUserId: req.user.userId,
      plans: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Pricing updated",
      data,
    });
  } catch (error) {
    next(error);
  }
};