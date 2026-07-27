import axios from "axios";
import env from "../config/env.js";

const LANGUAGE_ID_MAP = {
  c: 50,
  cpp: 54,
  java: 62,
  javascript: 63,
  python: 71,
};

const normalizeOutput = (value) => {
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
};

export const getLanguageId = (language) => {
  const languageId = LANGUAGE_ID_MAP[language];

  if (!languageId) {
    const error = new Error("Unsupported language");
    error.statusCode = 400;
    throw error;
  }

  return languageId;
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  "X-RapidAPI-Key": env.JUDGE0_API_KEY,
  "X-RapidAPI-Host": env.JUDGE0_API_HOST,
});



export const executeCode = async ({ language, code, stdin }) => {
  const languageId = getLanguageId(language);

console.log("=== CODE SENT TO JUDGE0 ===");
console.log(code);
console.log("=== LANGUAGE ===");
console.log(language);
console.log("=== STDIN ===");
console.log(stdin);

  try {
    const response = await axios.post(
      `${env.JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
      {
        source_code: code,
        language_id: languageId,
        stdin: stdin ?? "",
      },
      {
        headers: getHeaders(),
        timeout: 30000,
      }
    );

    const result = response.data;

    return {
      languageId,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
      compileOutput: result.compile_output || "",
      runtime: result.time || null,
      memory: result.memory ? String(result.memory) : null,
      statusId: result.status?.id || null,
      statusDescription: result.status?.description || "Unknown",
      message: result.message || "",
    };
  } catch (error) {
    const judgeError = new Error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||
        "Judge0 execution failed"
    );

    judgeError.statusCode = error?.response?.status || 500;
    throw judgeError;
  }
};

export const judgeSubmission = async ({ language, code, testCases }) => {
  let passedCount = 0;
  let finalStatus = "Accepted";
  let finalStdout = "";
  let finalStderr = "";
  let finalCompileOutput = "";
  let runtime = null;
  let memory = null;
  const languageId = getLanguageId(language);

  for (const testCase of testCases) {
    const result = await executeCode({
      language,
      code,
      stdin: testCase.input,
    });

    finalStdout = result.stdout;
    finalStderr = result.stderr || result.message;
    finalCompileOutput = result.compileOutput;
    runtime = result.runtime;
    memory = result.memory;

    if (result.compileOutput) {
      finalStatus = "Compilation Error";
      break;
    }

    if (
      result.stderr ||
      result.message ||
      (result.statusId && result.statusId >= 11 && result.statusId !== 3)
    ) {
      finalStatus = "Runtime Error";
      break;
    }

    const actual = normalizeOutput(result.stdout);
    const expected = normalizeOutput(testCase.expected);

    if (actual !== expected) {
      finalStatus = "Wrong Answer";
      break;
    }

    passedCount += 1;
  }

  return {
    languageId,
    status: finalStatus,
    verdict: finalStatus,
    stdout: finalStdout,
    stderr: finalStderr,
    compileOutput: finalCompileOutput,
    runtime,
    memory,
    passedCount,
    totalCount: testCases.length,
  };
};