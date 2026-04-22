import API from "./axios";

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

export const askAiAssistantApi = async (message: string) => {
  const response = await API.post("/ai/chat", { message });
  return response.data;
};