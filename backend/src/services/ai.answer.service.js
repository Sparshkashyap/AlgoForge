import { generateAiText, getActiveAiInfo } from "./ai.provider.service.js";

const buildContextBlock = ({ roleAwareContext, retrievedChunks }) => {
  const chunks = Array.isArray(retrievedChunks?.chunks)
    ? retrievedChunks.chunks
    : [];

  const retrievedText = chunks
    .slice(0, 6)
    .map((chunk, index) => {
      return `Source ${index + 1}: ${chunk.title}
Type: ${chunk.type}
Score: ${chunk.score}
Content:
${chunk.content || chunk.subtitle || ""}`;
    })
    .join("\n\n");

  return `
Role-aware platform context:
${JSON.stringify(roleAwareContext || {}, null, 2)}

Retrieved platform knowledge:
${retrievedText || "No retrieved context available."}
`;
};

const buildFallbackAnswer = ({
  message,
  intent,
  roleAwareContext,
  retrievedChunks,
  error,
}) => {
  const chunks = Array.isArray(retrievedChunks?.chunks)
    ? retrievedChunks.chunks
    : [];

  const creatorSummary = roleAwareContext?.roleContext?.summary;

  const creatorLines = creatorSummary
    ? `
- Total created problems: ${creatorSummary.totalCreatedProblems ?? 0}
- Draft problems: ${creatorSummary.draftProblems ?? 0}
- Rejected problems: ${creatorSummary.rejectedProblems ?? 0}
`
    : "";

  const sourceLines = chunks.length
    ? `
Relevant retrieved sources:
${chunks
  .slice(0, 3)
  .map((chunk) => `- ${chunk.title}`)
  .join("\n")}
`
    : "";

  return `AI model temporarily unavailable. Showing a direct answer based on platform context only.

Question: ${message}
Intent: ${intent}

${creatorLines}${sourceLines}

The provider error was: ${error?.message || "unknown error"}

Try again in a few seconds for a full model-generated answer.`;
};

export const generateAiAnswerService = async ({
  message,
  history = [],
  role,
  intent,
  roleAwareContext,
  retrievedChunks,
}) => {
  const aiInfo = getActiveAiInfo();

  const recentHistory = history
    .slice(-8)
    .map((item) => `${item.role}: ${item.content}`)
    .join("\n");

  const prompt = `
User role:
${role}

Detected intent:
${intent}

Recent chat history:
${recentHistory || "No previous history."}

User question:
${message}

${buildContextBlock({ roleAwareContext, retrievedChunks })}

Instructions:
- Answer directly and practically.
- Use the platform context when useful.
- If the user is a CREATOR, focus on content quality, problem creation, test cases, drafts, review status, and publishing.
- If the user is an ADMIN, focus on platform health, review queues, moderation, quality control, users, premium conversion, and operations.
- If the user is a USER, focus on practice, roadmap, weak topics, problems, contests, and submissions.
- Do not claim you used Gemini unless the active model is Gemini.
- Keep the response concise but useful.
`;

  try {
    const generated = await generateAiText({
      feature: "AI_CHAT",
      temperature: 0.35,
      system:
        "You are AlgoForge AI, a role-aware coding platform copilot. Be direct, practical, and context-aware.",
      prompt,
    });

    return {
      answer: generated.text,
      model: generated.model,
      provider: generated.provider,
      usedFallback: false,
    };
  } catch (error) {
    const fallback = buildFallbackAnswer({
      message,
      intent,
      roleAwareContext,
      retrievedChunks,
      error,
    });

    return {
      answer: fallback,
      model: "fallback-system",
      provider: aiInfo.provider,
      usedFallback: true,
    };
  }
};