import { runProblemCodeService } from "../services/execution.service.js";

export const runProblemCodeController = async (req, res, next) => {
  try {
    const result = await runProblemCodeService({
      problemId: req.validated.params.problemId,
      language: req.validated.body.language,
      code: req.validated.body.code,
      input: req.validated.body.input,
      expectedOutput: req.validated.body.expectedOutput,
      viewer: req.user || null,
    });

    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};