import prisma from "../config/db.js";
import { generateAiText } from "./ai.provider.service.js";

const parseJson = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    const error = new Error("AI returned invalid JSON");
    error.statusCode = 500;
    throw error;
  }
};

const extractJsonFromText = (text) => {
  const cleaned = String(text || "").trim();

  if (!cleaned) {
    const error = new Error("AI returned empty response");
    error.statusCode = 500;
    throw error;
  }

  try {
    return parseJson(cleaned);
  } catch {
    const fencedMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/i);
    if (fencedMatch?.[1]) {
      return parseJson(fencedMatch[1].trim());
    }

    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (objectMatch?.[0]) {
      return parseJson(objectMatch[0].trim());
    }

    const error = new Error("AI returned invalid JSON");
    error.statusCode = 500;
    throw error;
  }
};

const saveAIUsage = async ({ userId, feature, prompt }) => {
  if (!userId) return;

  try {
    await prisma.aIUsage.create({
      data: {
        userId,
        feature,
        prompt,
      },
    });
  } catch (error) {
    console.error("Failed to save AI usage:", error);
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
  const prompt = `
Return valid JSON only. No markdown. No explanation.

Generate this exact JSON shape:
{
  "languageTemplates": {
    "javascript": "...",
    "python": "...",
    "cpp": "...",
    "java": "...",
    "c": "..."
  },
  "referenceSolutions": {
    "javascript": "...",
    "python": "...",
    "cpp": "...",
    "java": "...",
    "c": "..."
  },
  "driverCode": {
    "javascript": "...",
    "python": "...",
    "cpp": "...",
    "java": "",
    "c": "..."
  }
}

Supported languages:
javascript, python, cpp, java, c

Rules:
- languageTemplates = user-facing starter boilerplate only.
- referenceSolutions = correct accepted solutions.
- driverCode = hidden runner code that reads stdin and prints exact expected output.
- For Java, template/reference should use:
public class Main {
    public static String solve(String input) {
    }
}
- Java driverCode should be empty string.
- Keep output deterministic.
- Do not include markdown fences.
- Do not include comments outside code strings.
- Escape newlines correctly inside JSON strings.

Problem title:
${title}

Problem description:
${description}

Constraints:
${constraints || ""}

Reference language:
${referenceLanguage}

Reference solution:
${referenceCode}
`;

  const response = await generateAiText({
    feature: "GENERATE_CODE_PACK",
    temperature: 0.1,
    system:
      "You are a strict coding platform code-pack generator. You only return valid JSON.",
    prompt,
  });

  const data = extractJsonFromText(response.text);

  await saveAIUsage({
    userId,
    feature: "GENERATE_CODE_PACK",
    prompt: title,
  });

  return data;
};

export const generateHintService = async ({
  userId,
  title,
  description,
  code,
}) => {
  const prompt = `
You are a coding interview mentor.
Give 3 short hints only.
Do not give the full solution.

Problem:
${title}

Description:
${description}

User code:
${code}
`;

  const response = await generateAiText({
    feature: "AI_HINT",
    temperature: 0.35,
    system:
      "You are a concise coding mentor. Help without revealing the full solution.",
    prompt,
  });

  await saveAIUsage({
    userId,
    feature: "AI_HINT",
    prompt: title,
  });

  return {
    hint: response.text.trim() || "No hint generated",
  };
};

export const reviewCodeService = async ({
  userId,
  title,
  description,
  code,
  language,
}) => {
  const prompt = `
Return valid JSON only. No markdown.

JSON shape:
{
  "summary": "...",
  "issues": ["..."],
  "improvements": ["..."]
}

Problem:
${title}

Description:
${description}

Language:
${language}

Code:
${code}
`;

  const response = await generateAiText({
    feature: "AI_REVIEW",
    temperature: 0.2,
    system:
      "You are a senior coding reviewer. Return concise valid JSON only.",
    prompt,
  });

  await saveAIUsage({
    userId,
    feature: "AI_REVIEW",
    prompt: title,
  });

  return extractJsonFromText(response.text || "{}");
};

export const basicAiExplainService = async ({ userId, code, language }) => {
  const prompt = `
Explain the following code clearly and briefly.

Focus on:
- what the code is doing
- the core approach
- likely time complexity
- one or two practical improvements

Return plain text only.

Language:
${language}

Code:
${code}
`;

  try {
    const response = await generateAiText({
      feature: "AI_EXPLAIN",
      temperature: 0.3,
      system: "You are a senior coding mentor.",
      prompt,
    });

    await saveAIUsage({
      userId,
      feature: "AI_EXPLAIN",
      prompt: language,
    });

    return {
      explanation:
        response.text.trim() ||
        `Code analysis:
Language: ${language}

This solution works but may not be optimal.
Try improving time complexity.

Code:
${code}`,
    };
  } catch (error) {
    return {
      explanation: `Code analysis:
Language: ${language}

The AI provider is temporarily unavailable, so here is a basic fallback:
This solution may work, but you should verify the parsing, edge cases, and time complexity.

Code:
${code}`,
    };
  }
};