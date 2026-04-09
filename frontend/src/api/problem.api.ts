import API from "./axios";

export const getProblemsApi = () => API.get("/problems");
export const getProblemBySlugApi = (slug: string) => API.get(`/problems/${slug}`);
export const createProblemApi = (payload: any) => API.post("/problems", payload);