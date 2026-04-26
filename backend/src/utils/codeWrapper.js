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

  return cleanDriverCode;
};

const mergeWithoutDuplicateIncludes = (baseIncludes, userCode) => {
  const lines = trim(userCode).split("\n");

  return lines
    .filter((line) => {
      const clean = line.trim();
      return !baseIncludes.some((inc) => clean === inc);
    })
    .join("\n")
    .trim();
};



export const buildExecutableCode = ({ language, userCode, driverCode }) => {
  const cleanUserCode = trim(userCode);
  const cleanDriverCode = trim(driverCode);

  if (!cleanUserCode) {
    const error = new Error("User code is required");
    error.statusCode = 400;
    throw error;
  }

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

  return cleanDriverCode.replace("{{USER_CODE}}", cleanUserCode);
};