import {
  getMyProfileService,
  updateMyProfileService,
  uploadAvatarService,
  getMySolveStatsService,
  getMyNotificationsService,
  getMyNotificationSummaryService,
  readMyNotificationService,
  readAllMyNotificationsService,
  getMyBadgesListService,
} from "../services/user.service.js";

export const getMyProfileController = async (req, res, next) => {
  try {
    const user = await getMyProfileService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfileController = async (req, res, next) => {
  try {
    const user = await updateMyProfileService({
      userId: req.user.userId,
      name: req.body.name,
      email: req.body.email,
      avatarUrl: req.body.avatarUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatarController = async (req, res, next) => {
  try {
    const user = await uploadAvatarService({
      userId: req.user.userId,
      file: req.file,
    });

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getMySolveStatsController = async (req, res, next) => {
  try {
    const stats = await getMySolveStatsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyNotificationsController = async (req, res, next) => {
  try {
    const notifications = await getMyNotificationsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyNotificationSummaryController = async (req, res, next) => {
  try {
    const summary = await getMyNotificationSummaryService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const readMyNotificationController = async (req, res, next) => {
  try {
    const notification = await readMyNotificationService({
      userId: req.user.userId,
      notificationId:
        req.validated?.params?.notificationId ?? req.params.notificationId,
    });

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
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
    const badges = await getMyBadgesListService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: badges,
    });
  } catch (error) {
    next(error);
  }
};