import prisma from "../config/db.js";
import { executeCode } from "./judge.service.js";
import { buildExecutableCode } from "../utils/codeWrapper.js";

export const runProblemCodeService = async ({
  problemId,
  language,
  code,
  input,
  expectedOutput,
  viewer,
}) => {
  const problem = await prisma.problem.findFirst({
    where: {
      id: problemId,
      isPublished: true,
    },
    select: {
      id: true,
      isPremium: true,
      title: true,
      driverCode: true,
    },
  });

  if (!problem) {
    const error = new Error("Problem not found");
    error.statusCode = 404;
    throw error;
  }

  const hasPremiumAccess =
    !problem.isPremium ||
    viewer?.role === "ADMIN" ||
    viewer?.plan === "PRO";

  if (!hasPremiumAccess) {
    const error = new Error("Upgrade to Pro to run this premium problem");
    error.statusCode = 403;
    throw error;
  }

  const driverCodeForLanguage = problem.driverCode?.[language];

  const executableCode = buildExecutableCode({
    language,
    userCode: code,
    driverCode: driverCodeForLanguage,
  });

  const result = await executeCode({
    language,
    code: executableCode,
    stdin: input,
  });

  let verdict = result.statusDescription;

  if (result.compileOutput) {
    verdict = "Compilation Error";
  } else if (result.stderr || result.message) {
    verdict = "Runtime Error";
  } else if (typeof expectedOutput === "string" && expectedOutput.trim()) {
    const actual = String(result.stdout ?? "").replace(/\r\n/g, "\n").trim();
    const expected = String(expectedOutput).replace(/\r\n/g, "\n").trim();
    verdict = actual === expected ? "Accepted" : "Wrong Answer";
  }

  return {
    ...result,
    verdict,
  };
};