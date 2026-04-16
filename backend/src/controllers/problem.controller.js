import {
  createProblemService,
  deleteProblemService,
  getProblemByIdForAdminService,
  getProblemBySlugService,
  listAdminProblemsService,
  listPublishedProblemsService,
  previewProblemRunService,
  updateProblemService,
} from "../services/problem.service.js";

export const createProblemController = async (req, res, next) => {
  try {
    const problem = await createProblemService(req.validated.body, req.user.userId);

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProblemController = async (req, res, next) => {
  try {
    const problem = await updateProblemService(
      req.params.problemId,
      req.validated.body,
      req.user.userId
    );

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProblemController = async (req, res, next) => {
  try {
    const result = await deleteProblemService(req.params.problemId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const previewProblemRunController = async (req, res) => {
  const { language, code, testCases, driverCode } = req.body;

  const result = await runProblemCodeService({
    language,
    code,
    testCases,
    driverCode,
  });

  res.json({ data: result });
};

export const listPublishedProblemsController = async (req, res, next) => {
  try {
    const problems = await listPublishedProblemsService();

    return res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemBySlugController = async (req, res, next) => {
  try {
    const problem = await getProblemBySlugService(req.params.slug, req.user || null);

    return res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemByIdForAdminController = async (req, res, next) => {
  try {
    const problem = await getProblemByIdForAdminService(req.params.problemId);

    return res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

export const listAdminProblemsController = async (req, res, next) => {
  try {
    const problems = await listAdminProblemsService();

    return res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error) {
    next(error);
  }
};