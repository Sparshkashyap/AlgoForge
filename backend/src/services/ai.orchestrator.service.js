import { detectAiIntentService } from "./ai.intent.service.js";
import { buildAiContextService } from "./ai.context.service.js";
import { retrieveAiContextChunksService } from "./ai.rag.service.js";
import { generateGeminiAnswerService } from "./ai.gemini.service.js";

export const askAiAssistantService = async ({
  message,
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
    role,
    intent: intentResult.intent,
  });

  const generated = await generateGeminiAnswerService({
    message,
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
      model: generated.model,
      usedFallback: generated.usedFallback,
      retrievedChunkCount: retrievedChunks.chunks.length,
    },
    contextPreview: {
      weakTags: roleAwareContext?.roleContext?.summary?.weakTags || [],
      strongTags: roleAwareContext?.roleContext?.summary?.strongTags || [],
      recentProblems: roleAwareContext?.shared?.recentProblems?.slice(0, 5) || [],
    },
  };
};