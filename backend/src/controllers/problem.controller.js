import {
  createProblemService,
  deleteProblemService,
  getProblemByIdForAdminService,
  getProblemByIdForManageService,
  getProblemBySlugService,
  listAdminProblemsService,
  listProblemsService,
  previewProblemRunService,
  updateProblemService,
  listMyCreatedProblemsService,
} from "../services/problem.service.js";

export const listProblemsController = async (req, res, next) => {
  try {
    const problems = await listProblemsService();

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
    const problem = await getProblemBySlugService(
      req.params.slug,
      req.user || null
    );

    return res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};

export const createProblemController = async (req, res, next) => {
  try {
    const problem = await createProblemService(
      req.validated?.body ?? req.body,
      req.user.userId
    );

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
      req.validated?.body ?? req.body,
      req.user
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
    const result = await deleteProblemService(
      req.params.problemId,
      req.user
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const previewProblemRunController = async (req, res, next) => {
  try {
    const { language, code, testCases, driverCode } =
      req.validated?.body ?? req.body;

    const result = await previewProblemRunService({
      language,
      code,
      testCases,
      driverCode,
    });

    return res.status(200).json({
      success: true,
      data: result,
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

export const listMyProblemsController = async (req, res, next) => {
  try {
    let problems;

    if (req.user.role === "ADMIN") {
      problems = await listAdminProblemsService();   // ✅ ALL problems
    } else {
      problems = await listMyCreatedProblemsService(req.user.userId); // creator only
    }

    return res.status(200).json({
      success: true,
      data: problems,
    });
  } catch (error) {
    next(error);
  }
};

export const getProblemByIdForManageController = async (req, res, next) => {
  try {
    const problem = await getProblemByIdForManageService(
      req.params.problemId,
      req.user
    );

    return res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error) {
    next(error);
  }
};