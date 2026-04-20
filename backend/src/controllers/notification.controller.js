import {
  listMyNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "../services/notification.service.js";

export const listMyNotificationsController = async (req, res, next) => {
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

export const markNotificationReadController = async (req, res, next) => {
  try {
    const data = await markNotificationReadService({
      notificationId: req.params.notificationId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      data,
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
    });
  } catch (error) {
    next(error);
  }
};