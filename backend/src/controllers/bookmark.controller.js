import {
  listMyBookmarksService,
  toggleBookmarkService,
} from "../services/bookmark.service.js";

export const listMyBookmarksController = async (req, res, next) => {
  try {
    const data = await listMyBookmarksService(req.user.userId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleBookmarkController = async (req, res, next) => {
  try {
    const data = await toggleBookmarkService({
      userId: req.user.userId,
      problemId: req.params.problemId,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};