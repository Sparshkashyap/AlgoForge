import { runProblemCodeService } from "../services/execution.service.js";

export const runProblemCodeController = async (req, res, next) => {
  try {
    const body = req.validated?.body ?? req.body;

    console.log("RAW BODY:", req.body);
    console.log("VALIDATED BODY:", req.validated?.body);

    const result = await runProblemCodeService({
      language: body.language,
      code: body.code,
      testCases: body.testCases,
      customInput:
        body.customInput ??
        body.stdin ??
        body.input ??
        req.body.customInput ??
        req.body.stdin ??
        req.body.input,
      expectedOutput:
        body.expectedOutput ??
        body.expected ??
        req.body.expectedOutput ??
        req.body.expected,
      driverCode: body.driverCode || req.body.driverCode || {},
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

