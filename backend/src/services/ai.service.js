import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";
import prisma from "../config/db.js";

let aiClient = null;

if (env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
  });
}

const ensureAI = () => {
  if (!aiClient) {
    const error = new Error("Gemini is not configured");
    error.statusCode = 500;
    throw error;
  }
};

const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const error = new Error("AI returned invalid JSON");
    error.statusCode = 500;
    throw error;
  }
};

export const generateProblemCodePackService = async ({
  userId,
  title,
  description,
  constraints,
  referenceLanguage,
  referenceCode,
}) => {
  ensureAI();

  const prompt = `
Return valid JSON only.

Generate these objects:
1. languageTemplates
2. referenceSolutions
3. driverCode

Supported languages:
javascript, python, cpp, java, c

Rules:
- languageTemplates = user-facing boilerplate
- referenceSolutions = correct accepted solutions
- driverCode = hidden runner code
- java reference/template should use:
public class Main {
    public static String solve(String input) {
    }
}
- java driverCode should be empty string

Problem title: ${title}
Problem description: ${description}
Constraints: ${constraints || ""}
Reference language: ${referenceLanguage}
Reference solution:
${referenceCode}
`;

  const response = await aiClient.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: prompt,
  });

  const text = response.text?.trim() || "";
  const data = parseJson(text);

  await prisma.aIUsage.create({
    data: {
      userId,
      feature: "GENERATE_CODE_PACK",
      prompt: title,
    },
  });

  return data;
};

export const generateHintService = async ({
  userId,
  title,
  description,
  code,
}) => {
  ensureAI();

  const prompt = `
You are a coding interview mentor.
Give 3 short hints only.
Do not give full solution.

Problem: ${title}
Description: ${description}

User code:
${code}
`;

  const response = await aiClient.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: prompt,
  });

  await prisma.aIUsage.create({
    data: {
      userId,
      feature: "AI_HINT",
      prompt: title,
    },
  });

  return {
    hint: response.text?.trim() || "No hint generated",
  };
};

export const reviewCodeService = async ({
  userId,
  title,
  description,
  code,
  language,
}) => {
  ensureAI();

  const prompt = `
You are reviewing a coding problem solution.

Return concise feedback in JSON:
{
  "summary": "...",
  "issues": ["..."],
  "improvements": ["..."]
}

Problem: ${title}
Description: ${description}
Language: ${language}

Code:
${code}
`;

  const response = await aiClient.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: prompt,
  });

  await prisma.aIUsage.create({
    data: {
      userId,
      feature: "AI_REVIEW",
      prompt: title,
    },
  });

  return parseJson(response.text?.trim() || "{}");
};