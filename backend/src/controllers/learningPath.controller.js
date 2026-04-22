import {
  createLearningPathService,
  getLearningPathByIdService,
  listLearningPathsService,
} from "../services/learningPath.service.js";

export const listLearningPathsController = async (_req, res, next) => {
  try {
    const data = await listLearningPathsService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getLearningPathByIdController = async (req, res, next) => {
  try {
    const data = await getLearningPathByIdService(req.params.pathId);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createLearningPathController = async (req, res, next) => {
  try {
    const data = await createLearningPathService({
      ...req.body,
      createdById: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};