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