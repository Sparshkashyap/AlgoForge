import env from "../config/env.js";

const RETRY_ATTEMPTS = 2;
const RETRY_DELAY = 900;

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const MODELS = [
  env.GEMINI_MODEL || "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

const buildSystemPrompt = ({ role, intent }) => `
You are AlgoForge AI, a production-grade in-product assistant for a coding practice platform.

Current user role: ${role}
Detected intent: ${intent}

Core behavior:
- Answer in crisp Hinglish.
- Be practical, product-aware, and direct.
- Do not sound generic, motivational, or fluffy.
- Use only the retrieved platform context and role-aware user context when possible.
- If context is incomplete, say so briefly and still give the best next step.
- Prefer bullets when giving actions.
- Keep answers compact but useful.

Role-specific rules:
- USER: focus on weak areas, next problems, roadmap, contest prep, analytics patterns, bookmarks, notes, and feature usage.
- CREATOR: focus on problem quality, review notes, testcase strength, duplication risk, publish readiness, and creator productivity.
- ADMIN: focus on platform health, premium conversion, review queue, moderation signals, growth, operations, and product risk.

Never invent stats that are not present in context.
`;

const buildConversationPrompt = (history = []) => {
  if (!history.length) return "No previous chat history.";

  return history
    .slice(-8)
    .map((item) => `${item.role === "assistant" ? "Assistant" : "User"}: ${item.content}`)
    .join("\n");
};

const buildRetrievedContextPrompt = (retrievedChunks) => {
  const chunks = retrievedChunks?.chunks || [];

  if (!chunks.length) {
    return "No retrieved chunks found.";
  }

  return chunks
    .map((chunk, index) => {
      return `[${index + 1}] ${chunk.type.toUpperCase()} | ${chunk.title}\n${chunk.content}`;
    })
    .join("\n\n");
};

const callGemini = async (model, body) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MODEL:${model} ERROR:${text}`);
  }

  const data = await res.json();

  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
};

export const generateGeminiAnswerService = async ({
  message,
  history = [],
  role,
  intent,
  roleAwareContext,
  retrievedChunks,
}) => {
  if (!env.GEMINI_API_KEY) {
    return fallback(message, role, intent, roleAwareContext, retrievedChunks);
  }

  const prompt = `
${buildSystemPrompt({ role, intent })}

Previous conversation:
${buildConversationPrompt(history)}

User question:
${message}

Role-aware platform context:
${JSON.stringify(roleAwareContext, null, 2)}

Retrieved chunks:
${buildRetrievedContextPrompt(retrievedChunks)}

Output rules:
- Give the direct answer first.
- Then give 3 to 5 concrete next actions when relevant.
- Mention retrieved context naturally if useful.
- Keep it clean plain text.
`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.45,
      maxOutputTokens: 850,
    },
  };

  for (const model of MODELS) {
    for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt += 1) {
      try {
        const answer = await callGemini(model, body);

        if (answer) {
          return {
            answer,
            model,
            usedFallback: false,
          };
        }
      } catch (error) {
        console.log(`Gemini retry ${attempt + 1} failed on ${model}`);

        if (attempt < RETRY_ATTEMPTS - 1) {
          await sleep(RETRY_DELAY);
        }
      }
    }
  }

  return fallback(message, role, intent, roleAwareContext, retrievedChunks);
};

const fallback = (message, role, intent, ctx, retrievedChunks) => {
  const sourceTitles = (retrievedChunks?.chunks || [])
    .slice(0, 4)
    .map((item) => item.title)
    .filter(Boolean);

  let answer =
    "AI service abhi temporary load me hai, lekin retrieved platform context ke basis par direct answer de raha hoon.\n\n";

  answer += `Question: ${message}\n`;
  answer += `Intent: ${intent}\n\n`;

  if (role === "USER") {
    answer += `- Solved count: ${ctx?.roleContext?.summary?.solvedCount || 0}\n`;
    answer += `- Streak: ${ctx?.roleContext?.summary?.streak || 0}\n`;
    answer += `- Weak tags: ${
      ctx?.roleContext?.summary?.weakTags?.map((item) => item.tag).join(", ") ||
      "not enough data"
    }\n`;
  }

  if (role === "CREATOR") {
    answer += `- Total created problems: ${ctx?.roleContext?.summary?.totalCreatedProblems || 0}\n`;
    answer += `- Draft problems: ${ctx?.roleContext?.summary?.draftProblems || 0}\n`;
    answer += `- Rejected problems: ${ctx?.roleContext?.summary?.rejectedProblems || 0}\n`;
  }

  if (role === "ADMIN") {
    answer += `- Users: ${ctx?.roleContext?.summary?.usersCount || 0}\n`;
    answer += `- Premium users: ${ctx?.roleContext?.summary?.premiumUsersCount || 0}\n`;
    answer += `- Pending review count: ${ctx?.roleContext?.summary?.pendingReviewCount || 0}\n`;
  }

  if (sourceTitles.length) {
    answer += `\nRelevant retrieved sources:\n- ${sourceTitles.join("\n- ")}\n`;
  }

  answer += "\nRetry after a few seconds for a full Gemini-generated answer.";

  return {
    answer,
    model: "fallback-system",
    usedFallback: true,
  };
};