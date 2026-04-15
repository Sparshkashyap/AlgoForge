import {
  createSubmissionService,
  listMySubmissionsService,
} from "../services/submission.service.js";

export const createSubmissionController = async (req, res, next) => {
  try {
    const submission = await createSubmissionService({
      ...req.validated.body,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Submission evaluated successfully",
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