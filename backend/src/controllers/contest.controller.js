import {
  createContestService,
  deleteContestService,
  getContestByIdService,
  listMyCreatedContestsService,
  listPublishedContestsService,
  registerForContestService,
  updateContestService,
} from "../services/contest.service.js";

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

export const listMyCreatedContestsController = async (req, res, next) => {
  try {
    const contests = await listMyCreatedContestsService(req.user.userId);

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
    const contest = await getContestByIdService({
      contestId: req.validated?.params?.contestId ?? req.params.contestId,
      userId: req.user?.userId || null,
    });

    return res.status(200).json({
      success: true,
      data: contest,
    });
  } catch (error) {
    next(error);
  }
};

export const createContestController = async (req, res, next) => {
  try {
    const contest = await createContestService({
      ...(req.validated?.body ?? req.body),
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

export const updateContestController = async (req, res, next) => {
  try {
    const contest = await updateContestService({
      contestId: req.validated?.params?.contestId ?? req.params.contestId,
      ...(req.validated?.body ?? req.body),
    });

    return res.status(200).json({
      success: true,
      message: "Contest updated successfully",
      data: contest,
    });
  } catch (error) {
    next(error);
  }
};

export const registerForContestController = async (req, res, next) => {
  try {
    const registration = await registerForContestService({
      contestId: req.validated?.params?.contestId ?? req.params.contestId,
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

export const deleteContestController = async (req, res, next) => {
  try {
    await deleteContestService(
      req.validated?.params?.contestId ?? req.params.contestId
    );

    return res.status(200).json({
      success: true,
      message: "Contest deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};