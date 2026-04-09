import {
  createSubmissionService,
  listMySubmissionsService
} from "../services/submission.service.js";
import { successResponse } from "../utils/response.js";

export const createSubmissionController = async (req, res, next) => {
  try {
    const { problemId, language, code } = req.validated.body;
    const submission = await createSubmissionService({
      userId: req.user.id,
      problemId,
      language,
      code
    });

    return successResponse(res, submission, "Submission created", 201);
  } catch (error) {
    next(error);
  }
};

export const listMySubmissionsController = async (req, res, next) => {
  try {
    const submissions = await listMySubmissionsService(req.user.id);
    return successResponse(res, submissions, "Submissions fetched");
  } catch (error) {
    next(error);
  }
};