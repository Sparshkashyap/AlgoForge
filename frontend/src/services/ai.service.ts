import API from "@/api/axios";

export const getAiHintApi = async (payload: {
  title: string;
  description: string;
  code: string;
}) => {
  try {
    const res = await API.post("/ai/hint", payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const reviewCodeApi = async (payload: {
  title: string;
  description: string;
  code: string;
  language: string;
}) => {
  try {
    const res = await API.post("/ai/review", payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const generateProblemCodePackApi = async (payload: {
  title: string;
  description: string;
  constraints?: string;
  referenceLanguage: string;
  referenceCode: string;
}) => {
  try {
    const res = await API.post("/ai/problem-code-pack", payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};

export const getAiRoadmapSuggestionsApi = async (payload: {
  goal?: string;
  currentLevel?: string;
  topics?: string[];
}) => {
  try {
    const res = await API.post("/ai/roadmap-suggestions", payload);
    return res.data;
  } catch (error: any) {
    throw error;
  }
};