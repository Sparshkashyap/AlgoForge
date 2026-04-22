import API from "./axios";

export const getMyProblemNoteApi = async (problemId: string) => {
  const response = await API.get(`/problem-notes/${problemId}`);
  return response.data;
};

export const saveMyProblemNoteApi = async (
  problemId: string,
  content: string
) => {
  const response = await API.put(`/problem-notes/${problemId}`, { content });
  return response.data;
};