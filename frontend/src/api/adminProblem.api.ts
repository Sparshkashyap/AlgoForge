import API from "./axios";
import type { ProblemTestCase } from "@/types/problem.types";

export type CreateProblemPayload = {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  constraints?: string;
  isPremium?: boolean;
  boilerplateMode?: "provided" | "optional" | "none";
  sampleInput?: string;
  sampleOutput?: string;
  explanation?: string;
  starterCode?: Record<string, string>;
  languageTemplates?: Record<string, string>;
  referenceSolutions?: Record<string, string>;
  driverCode?: Record<string, string>;
  isPublished?: boolean;
  testCases: ProblemTestCase[];
};

export const previewRunProblemApi = async (payload: {
  language: "javascript" | "python" | "cpp" | "java" | "c";
  code: string;
  testCases: ProblemTestCase[];
  driverCode?: Record<string, string>;
}) => {
  const response = await API.post("/problems/preview-run", payload);
  return response.data;
};

export const createProblemApi = async (payload: CreateProblemPayload) => {
  const response = await API.post("/problems", payload);
  return response.data;
};

export const updateProblemApi = async (
  problemId: string,
  payload: CreateProblemPayload
) => {
  const response = await API.put(`/problems/${problemId}`, payload);
  return response.data;
};

export const deleteProblemApi = async (problemId: string) => {
  const response = await API.delete(`/problems/${problemId}`);
  return response.data;
};

export const getAdminProblemsApi = async () => {
  const response = await API.get("/problems/admin/all/list");
  return response.data;
};

export const getAdminProblemByIdApi = async (problemId: string) => {
  const response = await API.get(`/problems/admin/${problemId}`);
  return response.data;
};

export const generateAllLanguageTemplatesApi = async (payload: {
  title: string;
  description: string;
  constraints?: string;
  referenceLanguage: "javascript" | "python" | "cpp" | "java" | "c";
  referenceCode: string;
}) => {
  const response = await API.post("/ai/generate-problem-code-pack", payload);
  return response.data;
};