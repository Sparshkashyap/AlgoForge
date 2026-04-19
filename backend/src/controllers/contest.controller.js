import {
  createContestService,
  getContestByIdService,
  listPublishedContestsService,
  registerForContestService,
} from "../services/contest.service.js";

export const createContestController = async (req, res, next) => {
  try {
    const contest = await createContestService({
      ...req.validated.body,
      createdById: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Contest created successfully",
      data: contest,
    });
  } catch (error) {
    next(error);
  }
};

export const listPublishedContestsController = async (_req, res, next) => {
  try {
    const contests = await listPublishedContestsService();

    return res.status(200).json({
      success: true,
      data: contests,
    });
  } catch (error) {
    next(error);
  }
};

export const getContestByIdController = async (req, res, next) => {
  try {
    const contest = await getContestByIdService(req.validated.params.contestId);

    return res.status(200).json({
      success: true,
      data: contest,
    });
  } catch (error) {
    next(error);
  }
};

export const registerForContestController = async (req, res, next) => {
  try {
    const registration = await registerForContestService({
      contestId: req.validated.params.contestId,
      userId: req.user.userId,
    });

    return res.status(200).json({
      success: true,
      message: "Contest registration successful",
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};