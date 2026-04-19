import { runProblemCodeService } from "../services/execution.service.js";

export const runProblemCodeController = async (req, res, next) => {
  try {
    const result = await runProblemCodeService({
      language: req.validated.body.language,
      code: req.validated.body.code,
      testCases: req.validated.body.testCases,
      driverCode: req.body.driverCode || {},
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};