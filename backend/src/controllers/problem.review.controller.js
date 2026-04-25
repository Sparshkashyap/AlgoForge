import {
  approveProblemService,
  listProblemsForReviewService,
  rejectProblemService,
  submitProblemForReviewService,
} from "../services/problem.review.service.js";

export const listProblemsForReviewController = async (_req, res, next) => {
  try {
    const data = await listProblemsForReviewService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const submitProblemForReviewController = async (req, res, next) => {
  try {
    const data = await submitProblemForReviewService({
      problemId: req.params.problemId,
      actorUserId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Problem submitted for review",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const approveProblemController = async (req, res, next) => {
  try {
    const data = await approveProblemService({
      problemId: req.params.problemId,
      actorUserId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Problem approved",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectProblemController = async (req, res, next) => {
  try {
    const data = await rejectProblemService({
      problemId: req.params.problemId,
      actorUserId: req.user.userId,
      reason: req.body.reason,
    });

    return res.status(200).json({
      success: true,
      message: "Problem rejected",
      data,
    });
  } catch (error) {
    next(error);
  }
};