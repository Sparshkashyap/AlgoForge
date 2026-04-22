import {
  getMyNotificationSummaryService,
  listMyNotificationsService,
  markAllMyNotificationsReadService,
  markMyNotificationReadService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "../services/notification.service.js";

export const getMyNotificationsController = async (req, res, next) => {
  try {
    const data = await listMyNotificationsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const listMyNotificationsController = getMyNotificationsController;

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

export const markMyNotificationReadController = async (req, res, next) => {
  try {
    const data = await markMyNotificationReadService({
      userId: req.user.userId,
      notificationId:
        req.validated?.params?.notificationId ?? req.params.notificationId,
    });

    return res.status(200).json({
      success: true,
      data,
      message: "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationReadController = async (req, res, next) => {
  try {
    const data = await markNotificationReadService({
      userId: req.user.userId,
      notificationId:
        req.validated?.params?.notificationId ?? req.params.notificationId,
    });

    return res.status(200).json({
      success: true,
      data,
      message: "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
};

export const markAllMyNotificationsReadController = async (req, res, next) => {
  try {
    const data = await markAllMyNotificationsReadService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsReadController = async (req, res, next) => {
  try {
    const data = await markAllNotificationsReadService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};