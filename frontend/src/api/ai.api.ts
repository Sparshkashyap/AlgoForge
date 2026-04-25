import API from "./axios";

export type AiHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AiChatSource = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  href?: string;
  score: number;
};

export type AiChatResponse = {
  success: boolean;
  data: {
    answer: string;
    meta: {
      role: "USER" | "CREATOR" | "ADMIN";
      intent: string;
      confidence: number;
      model: string;
      usedFallback: boolean;
      retrievedChunkCount: number;
    };
    sources: AiChatSource[];
    suggestedPrompts: string[];
    contextPreview: {
      weakTags: Array<{ tag: string; count: number }>;
      strongTags: Array<{ tag: string; count: number }>;
      recentProblems: Array<{
        title: string;
        slug: string;
        difficulty: string;
        tags?: string[];
      }>;
    };
  };
};

export const generateProblemCodePackApi = async (payload: {
  title: string;
  description: string;
  constraints?: string;
  referenceLanguage: "javascript" | "python" | "cpp" | "java" | "c";
  referenceCode: string;
}) => {
  const response = await API.post("/ai/generate-problem-code-pack", payload);
  return response.data;
};

export const getAiHintApi = async (payload: {
  title: string;
  description: string;
  code: string;
}) => {
  const response = await API.post("/ai/hint", payload);
  return response.data;
};

export const reviewCodeApi = async (payload: {
  title: string;
  description: string;
  code: string;
  language: string;
}) => {
  const response = await API.post("/ai/review", payload);
  return response.data;
};

export const askAiAssistantApi = async (
  message: string,
  history: AiHistoryMessage[] = []
): Promise<AiChatResponse> => {
  const response = await API.post("/ai/ai-chat", { message, history });
  return response.data;
};