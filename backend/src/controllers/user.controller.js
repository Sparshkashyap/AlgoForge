import {
  getMyProfileService,
  updateMyProfileService,
  uploadAvatarService,
  removeMyAvatarService,
  updateUserAvatarByAdminService,
  getMySolveStatsService,
  getMyNotificationsService,
  getMyNotificationSummaryService,
  readMyNotificationService,
  readAllMyNotificationsService,
  getMyBadgesListService,
} from "../services/user.service.js";

export const getMyProfileController = async (req, res, next) => {
  try {
    const data = await getMyProfileService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMeController = getMyProfileController;

export const updateMyProfileController = async (req, res, next) => {
  try {
    const body = req.validated?.body ?? req.body;

    const data = await updateMyProfileService({
      userId: req.user.userId,
      name: body.name,
      email: body.email,
      avatarUrl: body.avatarUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMeController = updateMyProfileController;

export const uploadAvatarController = async (req, res, next) => {
  try {
    const data = await uploadAvatarService({
      userId: req.user.userId,
      file: req.file,
    });

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMyAvatarController = async (req, res, next) => {
  try {
    const data = await removeMyAvatarService(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Avatar removed successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatarByAdminController = async (req, res, next) => {
  try {
    const userId = req.validated?.params?.userId ?? req.params.userId;
    const avatarUrl = req.validated?.body?.avatarUrl ?? req.body.avatarUrl;

    const data = await updateUserAvatarByAdminService(userId, avatarUrl);

    return res.status(200).json({
      success: true,
      message: "User avatar updated successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatarController = updateUserAvatarByAdminController;

export const getMySolveStatsController = async (req, res, next) => {
  try {
    const data = await getMySolveStatsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyNotificationsController = async (req, res, next) => {
  try {
    const data = await getMyNotificationsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyNotificationSummaryController = async (req, res, next) => {
  try {
    const data = await getMyNotificationSummaryService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const readMyNotificationController = async (req, res, next) => {
  try {
    const data = await readMyNotificationService({
      userId: req.user.userId,
      notificationId:
        req.validated?.params?.notificationId ?? req.params.notificationId,
    });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const readAllMyNotificationsController = async (req, res, next) => {
  try {
    const result = await readAllMyNotificationsService(req.user.userId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyBadgesController = async (req, res, next) => {
  try {
    const data = await getMyBadgesListService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};