import { GoogleGenAI } from "@google/genai";
import env from "../config/env.js";

let geminiClient = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getActiveProvider = () =>
  String(env.AI_PROVIDER || "gemini").trim().toLowerCase();

const getActiveModel = () => {
  const provider = getActiveProvider();

  if (env.AI_MODEL) return env.AI_MODEL;

  if (provider === "groq") return env.GROQ_MODEL || "llama-3.3-70b-versatile";
  if (provider === "xai") return env.XAI_MODEL || "grok-2-latest";

  return env.GEMINI_MODEL || "gemini-2.5-flash";
};

const createAiError = (message, statusCode = 500, metadata = {}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.metadata = metadata;
  return error;
};

const ensureConfigured = () => {
  const provider = getActiveProvider();

  if (provider === "gemini" && !env.GEMINI_API_KEY) {
    throw createAiError("Gemini is not configured", 500, { provider });
  }

  if (provider === "groq" && !env.GROQ_API_KEY) {
    throw createAiError("Groq is not configured", 500, { provider });
  }

  if (provider === "xai" && !env.XAI_API_KEY) {
    throw createAiError("xAI/Grok is not configured", 500, { provider });
  }

  if (!["gemini", "groq", "xai"].includes(provider)) {
    throw createAiError(`Unsupported AI provider: ${provider}`, 500, {
      provider,
    });
  }
};

const getGeminiClient = () => {
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });
  }

  return geminiClient;
};

const extractGeminiText = (response) => {
  if (typeof response?.text === "string") {
    return response.text.trim();
  }

  if (typeof response?.text === "function") {
    return String(response.text() || "").trim();
  }

  return "";
};

const generateWithGemini = async ({ prompt, system, temperature }) => {
  const client = getGeminiClient();

  const mergedPrompt = system
    ? `${system.trim()}\n\n${String(prompt || "").trim()}`
    : String(prompt || "").trim();

  const response = await client.models.generateContent({
    model: getActiveModel(),
    contents: mergedPrompt,
    config: {
      temperature,
    },
  });

  return extractGeminiText(response);
};

const generateWithOpenAiCompatible = async ({
  prompt,
  system,
  temperature,
  provider,
}) => {
  const isGroq = provider === "groq";

  const baseUrl = isGroq ? env.GROQ_BASE_URL : env.XAI_BASE_URL;
  const apiKey = isGroq ? env.GROQ_API_KEY : env.XAI_API_KEY;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getActiveModel(),
      temperature,
      messages: [
        {
          role: "system",
          content:
            system ||
            "You are AlgoForge AI. Give direct, useful, production-quality answers.",
        },
        {
          role: "user",
          content: String(prompt || ""),
        },
      ],
    }),
    signal: AbortSignal.timeout(env.AI_TIMEOUT_MS),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw createAiError(
      data?.error?.message ||
        data?.message ||
        `${provider} AI request failed`,
      response.status,
      {
        provider,
        model: getActiveModel(),
        raw: data,
      }
    );
  }

  return String(data?.choices?.[0]?.message?.content || "").trim();
};

const shouldRetry = (error) => {
  const statusCode = Number(error?.statusCode || error?.status || 0);

  return (
    statusCode === 0 ||
    statusCode === 408 ||
    statusCode === 429 ||
    statusCode === 500 ||
    statusCode === 502 ||
    statusCode === 503 ||
    statusCode === 504
  );
};

export const generateAiText = async ({
  prompt,
  system,
  temperature = 0.25,
  feature = "AI",
}) => {
  ensureConfigured();

  const provider = getActiveProvider();
  const model = getActiveModel();

  let lastError = null;

  for (let attempt = 0; attempt <= env.AI_MAX_RETRIES; attempt += 1) {
    try {
      const text =
        provider === "gemini"
          ? await generateWithGemini({ prompt, system, temperature })
          : await generateWithOpenAiCompatible({
              prompt,
              system,
              temperature,
              provider,
            });

      if (!text) {
        throw createAiError("AI returned empty response", 500, {
          provider,
          model,
          feature,
        });
      }

      return {
        text,
        provider,
        model,
        usedFallback: false,
      };
    } catch (error) {
      lastError = error;

      if (attempt >= env.AI_MAX_RETRIES || !shouldRetry(error)) {
        break;
      }

      await sleep(500 * (attempt + 1));
    }
  }

  const finalError = createAiError(
    lastError?.message || "AI provider request failed",
    lastError?.statusCode || lastError?.status || 500,
    {
      provider,
      model,
      feature,
      original: lastError?.metadata || null,
    }
  );

  throw finalError;
};

export const getActiveAiInfo = () => ({
  provider: getActiveProvider(),
  model: getActiveModel(),
});