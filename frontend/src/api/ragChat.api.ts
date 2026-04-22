import API from "./axios";

export const askRagChatApi = async (payload: {
  question: string;
  context?: string[];
}) => {
  const response = await API.post("/rag-chat/ask", payload);
  return response.data;
};