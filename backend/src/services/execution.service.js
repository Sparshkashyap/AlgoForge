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

  const headers = {
    "Content-Type": "application/json",
  };

  if (env.JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = env.JUDGE0_API_KEY;
  }

  const { data } = await axios.post(
    `${env.JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
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
};

export const runProblemCodeService = async ({
  language,
  code,
  testCases,
  driverCode,
}) => {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    const error = new Error("At least one test case is required");
    error.statusCode = 400;
    throw error;
  }

  const executableCode = buildExecutableCode({
    language,
    userCode: code,
    driverCode: driverCode?.[language] ?? "",
  });

  let passedCount = 0;
  let finalVerdict = "Accepted";
  let finalStdout = "";
  let finalStderr = "";
  let finalCompileOutput = "";
  let runtime = null;
  let memory = null;

  for (const testCase of testCases) {
    const result = await executeJudge0Service({
      language,
      sourceCode: executableCode,
      stdin: testCase.input,
    });

    finalStdout = result.stdout || "";
    finalStderr = result.stderr || result.message || "";
    finalCompileOutput = result.compile_output || "";
    runtime = result.time || null;
    memory = result.memory || null;

    if (result.compile_output) {
      finalVerdict = "Compilation Error";
      break;
    }

    if (
      result.stderr ||
      result.message ||
      (result.status?.id && result.status.id >= 11 && result.status.id !== 3)
    ) {
      finalVerdict = "Runtime Error";
      break;
    }

    const actual = normalizeOutput(result.stdout);
    const expected = normalizeOutput(testCase.expected);

    if (actual !== expected) {
      finalVerdict = "Wrong Answer";
      break;
    }

    passedCount += 1;
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
    totalCount: testCases.length,
  };
};