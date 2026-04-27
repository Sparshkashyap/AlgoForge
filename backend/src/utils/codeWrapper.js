const trim = (value = "") => String(value ?? "").trim();

const ensureUserCode = (userCode) => {
  const cleanUserCode = trim(userCode);

  if (!cleanUserCode) {
    const error = new Error("User code is required");
    error.statusCode = 400;
    throw error;
  }

  return cleanUserCode;
};

const ensureDriverCode = ({ language, driverCode }) => {
  const cleanDriverCode = trim(driverCode);

  if (!cleanDriverCode) {
    const error = new Error(`Driver code is missing for language: ${language}`);
    error.statusCode = 500;
    throw error;
  }

  if (!cleanDriverCode.includes("{{USER_CODE}}")) {
    const error = new Error(
      `Driver code for ${language} must contain {{USER_CODE}} placeholder`
    );
    error.statusCode = 500;
    throw error;
  }

  return cleanDriverCode;
};

const removeDuplicateIncludes = (userCode, includes = []) => {
  return trim(userCode)
    .split("\n")
    .filter((line) => {
      const clean = line.trim();
      return !includes.includes(clean);
    })
    .join("\n")
    .trim();
};

const normalizeJavaUserCode = (userCode) => {
  let code = trim(userCode);

  code = removeDuplicateIncludes(code, ["import java.util.*;"]);

  if (/\bpublic\s+class\s+Main\b/.test(code) || /\bclass\s+Main\b/.test(code)) {
    const error = new Error(
      "Java user code must not declare class Main. Use class Solution only."
    );
    error.statusCode = 400;
    throw error;
  }

  code = code.replace(/\bpublic\s+class\s+Solution\b/g, "class Solution");

  return code;
};

export const buildExecutableCode = ({ language, userCode, driverCode }) => {
  const normalizedLanguage = String(language || "").toLowerCase();

  let cleanUserCode = ensureUserCode(userCode);
  const cleanDriverCode = ensureDriverCode({
    language: normalizedLanguage,
    driverCode,
  });

  if (normalizedLanguage === "java") {
    cleanUserCode = normalizeJavaUserCode(cleanUserCode);
  }

  if (normalizedLanguage === "cpp") {
    cleanUserCode = removeDuplicateIncludes(cleanUserCode, [
      "#include <bits/stdc++.h>",
      "using namespace std;",
    ]);
  }

  if (normalizedLanguage === "c") {
    cleanUserCode = removeDuplicateIncludes(cleanUserCode, [
      "#include <stdio.h>",
      "#include <stdlib.h>",
      "#include <string.h>",
    ]);
  }

  return cleanDriverCode.replace("{{USER_CODE}}", cleanUserCode);
};