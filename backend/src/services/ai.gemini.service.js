import env from "../config/env.js";

const RETRY_ATTEMPTS = 1;
const RETRY_DELAY = 300; // ms

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const MODELS = [
  env.GEMINI_MODEL || "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
];

const buildSystemPrompt = ({ role, intent }) => {
  return `
You are AlgoForge AI.
You answer in Hinglish.
Be practical, not generic.

Role: ${role}
Intent: ${intent}

Rules:
- USER → learning, weak areas, next steps
- CREATOR → problem quality, drafts, improvements
- ADMIN → system health, growth, moderation

No fluff. No motivation lines. Give actionable answers.
`;
};

const buildUserPrompt = ({ message, roleAwareContext, retrievedChunks }) => {
  return `
Question:
${message}

Context:
${JSON.stringify(roleAwareContext, null, 2)}

Retrieved:
${JSON.stringify(retrievedChunks, null, 2)}

Answer in Hinglish.
`;
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

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    null
  );
};

export const generateGeminiAnswerService = async ({
  message,
  role,
  intent,
  roleAwareContext,
  retrievedChunks,
}) => {
  if (!env.GEMINI_API_KEY) {
    return fallback(message, role, intent, roleAwareContext);
  }

  const body = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${buildSystemPrompt({ role, intent })}\n\n${buildUserPrompt({
              message,
              roleAwareContext,
              retrievedChunks,
            })}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 700,
    },
  };

  // 🔥 retry + model fallback loop
  for (let model of MODELS) {
    for (let i = 0; i < RETRY_ATTEMPTS; i++) {
      try {
        const answer = await callGemini(model, body);

        if (answer) {
          return {
            answer,
            model,
            usedFallback: false,
          };
        }
      } catch (err) {
        console.log(`Gemini retry ${i + 1} failed on ${model}`);

        if (i < RETRY_ATTEMPTS - 1) {
          await sleep(RETRY_DELAY);
        }
      }
    }
  }

  // 🚨 if all fail
  return fallback(message, role, intent, roleAwareContext);
};

const fallback = (message, role, intent, ctx) => {
  let answer =
  "AI service abhi load me hai. Main tumhare recent activity aur platform data ke basis par answer de raha hoon.\n\n";
  if (role === "USER") {
    answer += `- Solved: ${ctx?.roleContext?.summary?.solvedCount || 0}\n`;
    answer += `- Weak tags: ${
      ctx?.roleContext?.summary?.weakTags?.map((t) => t.tag).join(", ") ||
      "not enough data"
    }\n`;
  }

  if (role === "CREATOR") {
    answer += `- Drafts: ${ctx?.roleContext?.summary?.draftProblems || 0}\n`;
    answer += `- Rejected: ${ctx?.roleContext?.summary?.rejectedProblems || 0}\n`;
  }

  if (role === "ADMIN") {
    answer += `- Users: ${ctx?.roleContext?.summary?.usersCount || 0}\n`;
    answer += `- Revenue users: ${ctx?.roleContext?.summary?.premiumUsersCount || 0}\n`;
  }

  answer += `\nTry again in few seconds for better AI answer.`;

  return {
    answer,
    model: "fallback-system",
    usedFallback: true,
  };
};