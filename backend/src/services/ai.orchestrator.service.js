import { detectAiIntentService } from "./ai.intent.service.js";
import { buildAiContextService } from "./ai.context.service.js";
import { retrieveAiContextChunksService } from "./ai.rag.service.js";
import { generateAiAnswerService } from "./ai.answer.service.js";

const buildSuggestedPrompts = ({ role, intent, roleAwareContext }) => {
  if (role === "ADMIN") {
    return [
      "Pending review queue ko kaise reduce karein?",
      "Premium conversion improve karne ke liye 3 direct steps do",
      "Platform health ke top 5 risks batao",
    ];
  }

  if (role === "CREATOR") {
    return [
      "Rejected drafts ko improve karne ke liye checklist do",
      "Mere problem tags me coverage gaps kya hain?",
      "Publishing se pehle testcase quality audit do",
    ];
  }

  const weakTags =
    roleAwareContext?.roleContext?.summary?.weakTags
      ?.slice(0, 2)
      ?.map((item) => item.tag)
      ?.filter(Boolean) || [];

  if (intent === "contest_help") {
    return [
      "Next contest ke liye 5-day prep plan banao",
      "Contest me speed improve karne ke direct steps do",
      "Meri current level ke hisaab se contest strategy do",
    ];
  }

  if (weakTags.length) {
    return [
      `${weakTags.join(" aur ")} ke liye next problems suggest karo`,
      "Meri weak areas ke liye 7 din ka roadmap do",
      "Recent submissions ke basis par improvement plan do",
    ];
  }

  return [
    "Mere next 5 problems suggest karo",
    "Mere liye roadmap banao",
    "Recent performance ke basis par advice do",
  ];
};

export const askAiAssistantService = async ({
  message,
  history = [],
  userId,
  role = "USER",
}) => {
  const intentResult = detectAiIntentService({
    message,
    role,
  });

  const roleAwareContext = await buildAiContextService({
    userId,
    role,
    intent: intentResult.intent,
  });

  const retrievedChunks = await retrieveAiContextChunksService({
    message,
    userId,
    role,
    intent: intentResult.intent,
  });

  const generated = await generateAiAnswerService({
    message,
    history,
    role,
    intent: intentResult.intent,
    roleAwareContext,
    retrievedChunks,
  });

  return {
    answer: generated.answer,
    meta: {
      role,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      provider: generated.provider,
      model: generated.model,
      usedFallback: generated.usedFallback,
      retrievedChunkCount: retrievedChunks.chunks.length,
    },
    sources: retrievedChunks.chunks.slice(0, 6).map((chunk) => ({
      id: chunk.id,
      type: chunk.type,
      title: chunk.title,
      subtitle: chunk.subtitle,
      href: chunk.href,
      score: chunk.score,
    })),
    suggestedPrompts: buildSuggestedPrompts({
      role,
      intent: intentResult.intent,
      roleAwareContext,
    }),
    contextPreview: {
      weakTags: roleAwareContext?.roleContext?.summary?.weakTags || [],
      strongTags: roleAwareContext?.roleContext?.summary?.strongTags || [],
      recentProblems:
        roleAwareContext?.shared?.recentProblems?.slice(0, 5) || [],
    },
  };
};