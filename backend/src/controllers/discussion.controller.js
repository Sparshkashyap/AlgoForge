import {
  createDiscussionReplyService,
  createProblemDiscussionService,
  listProblemDiscussionsService,
} from "../services/discussion.service.js";

export const listProblemDiscussionsController = async (req, res, next) => {
  try {
    const data = await listProblemDiscussionsService(req.params.problemId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createProblemDiscussionController = async (req, res, next) => {
  try {
    const data = await createProblemDiscussionService({
      problemId: req.params.problemId,
      userId: req.user.userId,
      content: req.body.content,
    });

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createDiscussionReplyController = async (req, res, next) => {
  try {
    const data = await createDiscussionReplyService({
      discussionId: req.params.discussionId,
      userId: req.user.userId,
      content: req.body.content,
    });

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};