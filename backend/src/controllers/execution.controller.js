import prisma from "../config/db.js";
import { runProblemCodeService } from "../services/execution.service.js";

export const runProblemCodeController = async (req, res, next) => {
  try {
    const body = req.validated?.body ?? req.body;
    const { problemId } = req.params;
    const language = String(body.language || "").toLowerCase();

    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true },
    });

    if (!problem) {
      const error = new Error("Problem not found");
      error.statusCode = 404;
      throw error;
    }

    const selectedDriverCode =
      body.driverCode?.[language] || problem.driverCode?.[language] || "";

    const result = await runProblemCodeService({
      language,
      code: body.code,
      testCases: body.testCases || problem.testCases || [],
      customInput: body.customInput ?? body.stdin ?? body.input,
      expectedOutput: body.expectedOutput ?? body.expected,
      driverCode: selectedDriverCode,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};