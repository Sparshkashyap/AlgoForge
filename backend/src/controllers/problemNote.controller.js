import {
  getMyProblemNoteService,
  saveMyProblemNoteService,
} from "../services/problemNote.service.js";

export const getMyProblemNoteController = async (req, res, next) => {
  try {
    const data = await getMyProblemNoteService({
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

export const saveMyProblemNoteController = async (req, res, next) => {
  try {
    const data = await saveMyProblemNoteService({
      userId: req.user.userId,
      problemId: req.params.problemId,
      content: req.body.content,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};