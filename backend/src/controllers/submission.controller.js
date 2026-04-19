import {
  createSubmissionService,
  getSubmissionByIdForUserService,
  listMySubmissionsService,
} from "../services/submission.service.js";

export const createSubmissionController = async (req, res, next) => {
  try {
    const submission = await createSubmissionService({
      problemId: req.validated.body.problemId,
      language: req.validated.body.language,
      code: req.validated.body.code,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Submission queued successfully",
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};

export const listMySubmissionsController = async (req, res, next) => {
  try {
    const submissions = await listMySubmissionsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionStatusController = async (req, res, next) => {
  try {
    const submission = await getSubmissionByIdForUserService({
      submissionId: req.params.submissionId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
};