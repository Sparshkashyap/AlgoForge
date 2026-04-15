import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";

let aiClient = null;

if (env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
  });
}

export const generateHintService = async ({ title, description, code }) => {
  if (!aiClient) {
    return {
      hint: "AI is not configured yet. Add GEMINI_API_KEY in backend .env.",
    };
  }

  const prompt = `
You are an algorithm mentor.
Do not provide full solution unless necessary.
Give only 3 short hints.

Problem title: ${title}
Problem description: ${description}
User code:
${code || "No code provided"}
`;

  const response = await aiClient.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: prompt,
  });

  return {
    hint: response.text,
  };
};

export const generateProblemCodePackService = async ({
  title,
  description,
  constraints,
  referenceLanguage,
  referenceCode,
}) => {
  if (!aiClient) {
    const error = new Error("GEMINI_API_KEY is not configured");
    error.statusCode = 500;
    throw error;
  }

  const prompt = `
You are generating code templates for a coding platform.

Goal:
Generate 4 objects in valid JSON only:
1. languageTemplates
2. referenceSolutions
3. driverCode

Supported languages:
- javascript
- python
- cpp
- java
- c

Rules:
- languageTemplates must be user-facing function-only code when reasonable
- referenceSolutions must be correct accepted solutions
- driverCode must be hidden wrapper/runner code
- For Java, languageTemplates/referenceSolutions should use:
public class Main {
    public static String solve(String input) {
    }
}
- For Java, driverCode can be empty string because backend injects main automatically
- Return pure JSON only, no markdown

Problem title: ${title}
Problem description: ${description}
Constraints: ${constraints || ""}
Reference language: ${referenceLanguage}
Reference code:
${referenceCode}
`;

  const response = await aiClient.models.generateContent({
    model: env.GEMINI_MODEL,
    contents: prompt,
  });

  const text = response.text?.trim() || "";

  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    const error = new Error("AI returned invalid JSON for code generation");
    error.statusCode = 500;
    throw error;
  }
};