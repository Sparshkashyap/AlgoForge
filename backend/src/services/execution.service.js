import axios from "axios";
import env from "../config/env.js";
import { buildExecutableCode } from "../utils/codeWrapper.js";

const LANGUAGE_MAP = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
  c: 50,
};

const judge0BaseUrl = String(env.JUDGE0_API_URL || "").replace(/\/+$/, "");

const normalizeOutput = (value) =>
  String(value ?? "").replace(/\r\n/g, "\n").trim();

export const executeJudge0Service = async ({
  language,
  sourceCode,
  stdin = "",
}) => {
  const languageId = LANGUAGE_MAP[language?.toLowerCase()];

  if (!languageId) {
    const error = new Error("Unsupported language");
    error.statusCode = 400;
    throw error;
  }

  if (!judge0BaseUrl) {
    const error = new Error("JUDGE0_API_URL is not configured");
    error.statusCode = 500;
    throw error;
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (env.JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = env.JUDGE0_API_KEY;
  }

  try {
    const { data } = await axios.post(
      `${judge0BaseUrl}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
      },
      {
        headers,
        timeout: 120000,
      }
    );

    return data;
  } catch (error) {
    console.error("🔥 Judge0 error:", {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    const judgeError = new Error(
      error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Judge0 execution failed"
    );

    judgeError.statusCode = error.response?.status || 500;
    throw judgeError;
  }
};

export const runProblemCodeService = async ({
  language,
  code,
  testCases,
  driverCode,
  customInput,
  expectedOutput,
}) => {
  const normalizedLanguage = String(language || "").toLowerCase();

  const hasCustomInput =
    typeof customInput === "string" && customInput.trim().length > 0;

  const casesToRun = hasCustomInput
    ? [
        {
          input: customInput,
          expected: expectedOutput ?? "",
          isCustom: true,
        },
      ]
    : Array.isArray(testCases)
      ? testCases
      : [];

  if (!hasCustomInput && casesToRun.length === 0) {
    const error = new Error("At least one test case is required");
    error.statusCode = 400;
    throw error;
  }

  const selectedDriverCode =
    typeof driverCode === "string"
      ? driverCode
      : driverCode?.[normalizedLanguage] ?? "";

  const executableCode =
    normalizedLanguage === "java" && String(code || "").includes("public static void main")
      ? code
      : buildExecutableCode({
          language: normalizedLanguage,
          userCode: code,
          driverCode: selectedDriverCode,
        });

  console.log("FINAL SOURCE SENT TO JUDGE0:\n", executableCode);

  let passedCount = 0;
  let finalVerdict = "Accepted";
  let finalStdout = "";
  let finalStderr = "";
  let finalCompileOutput = "";
  let runtime = null;
  let memory = null;

  const results = [];

  for (const testCase of casesToRun) {
    const result = await executeJudge0Service({
      language: normalizedLanguage,
      sourceCode: executableCode,
      stdin: testCase.input ?? "",
    });

    const stdout = result.stdout || "";
    const stderr = result.stderr || result.message || "";
    const compileOutput = result.compile_output || "";
    const actual = normalizeOutput(stdout);
    const expected = normalizeOutput(testCase.expected);

    finalStdout = stdout;
    finalStderr = stderr;
    finalCompileOutput = compileOutput;
    runtime = result.time || null;
    memory = result.memory ? String(result.memory) : null;

    let caseVerdict = "Accepted";

    if (compileOutput) {
      caseVerdict = "Compilation Error";
    } else if (
      stderr ||
      (result.status?.id && result.status.id >= 11 && result.status.id !== 3)
    ) {
      caseVerdict = "Runtime Error";
    } else if (!hasCustomInput && actual !== expected) {
      caseVerdict = "Wrong Answer";
    } else if (hasCustomInput && expected && actual !== expected) {
      caseVerdict = "Wrong Answer";
    } else {
      passedCount += 1;
    }

    if (finalVerdict === "Accepted" && caseVerdict !== "Accepted") {
      finalVerdict = caseVerdict;
    }

    results.push({
      input: testCase.input ?? "",
      expected: testCase.expected ?? "",
      actual,
      stdout,
      stderr,
      compileOutput,
      status: caseVerdict,
      verdict: caseVerdict,
      runtime: result.time || null,
      memory: result.memory ? String(result.memory) : null,
      isCustom: Boolean(testCase.isCustom),
    });
  }

  return {
    status: finalVerdict,
    verdict: finalVerdict,
    stdout: finalStdout,
    stderr: finalStderr,
    compileOutput: finalCompileOutput,
    runtime,
    memory,
    passedCount,
    totalCount: casesToRun.length,
    results,
    isCustomRun: hasCustomInput,
  };
};