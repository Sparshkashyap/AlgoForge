import prisma from "../config/db.js";
import { executeCode } from "./judge.service.js";
import { buildExecutableCode } from "../utils/codeWrapper.js";


export const runProblemCodeService = async ({
  language,
  code,
  testCases,
  driverCode,
}) => {
  let passed = 0;

  for (const tc of testCases) {
    const finalCode = buildExecutableCode({
      language,
      userCode: code,
      driverCode,
    });

    const result = await executeCode({
      language,
      code: finalCode,
      stdin: tc.input,
    });

    const actual = (result.stdout || "").trim();
    const expected = (tc.output || "").trim();

    if (actual === expected) passed++;
  }

  return {
    verdict: passed === testCases.length ? "Accepted" : "Wrong Answer",
    passedCount: passed,
    totalCount: testCases.length,
  };
};