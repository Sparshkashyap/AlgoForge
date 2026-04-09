import API from "./axios";

export const getAiHintApi = (payload: {
  title: string;
  description: string;
  code: string;
}) => API.post("/ai/hint", payload);