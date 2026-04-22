import API from "./axios";

export const listProblemDiscussionsApi = async (problemId: string) => {
  const response = await API.get(`/discussions/problem/${problemId}`);
  return response.data;
};

export const createProblemDiscussionApi = async (
  problemId: string,
  content: string
) => {
  const response = await API.post(`/discussions/problem/${problemId}`, {
    content,
  });
  return response.data;
};

export const createDiscussionReplyApi = async (
  discussionId: string,
  content: string
) => {
  const response = await API.post(`/discussions/reply/${discussionId}`, {
    content,
  });
  return response.data;
};