import API from "@/api/axios";

// Get full roadmap (user-specific or global)
export const getRoadmapApi = async () => {
  const res = await API.get("/roadmap");
  return res.data;
};

// Get roadmap by id (for deep view / page)
export const getRoadmapByIdApi = async (roadmapId: string) => {
  const res = await API.get(`/roadmap/${roadmapId}`);
  return res.data;
};

// Mark a step as completed
export const completeRoadmapStepApi = async (payload: {
  roadmapId: string;
  stepId: string;
}) => {
  const res = await API.post("/roadmap/complete-step", payload);
  return res.data;
};

// Reset roadmap progress
export const resetRoadmapApi = async (roadmapId: string) => {
  const res = await API.post(`/roadmap/${roadmapId}/reset`);
  return res.data;
};

// (Optional but useful) AI-powered roadmap generation
export const generateRoadmapApi = async (payload: {
  goal: string;
  level?: "beginner" | "intermediate" | "advanced";
}) => {
  const res = await API.post("/roadmap/generate", payload);
  return res.data;
};