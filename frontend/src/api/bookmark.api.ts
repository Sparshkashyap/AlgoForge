import API from "./axios";

// Get all bookmarks
export const getMyBookmarksApi = async () => {
  const res = await API.get("/users/bookmarks");
  return res.data;
};

// Add bookmark
export const addBookmarkApi = async (problemId: string) => {
  const res = await API.post("/users/bookmarks", { problemId });
  return res.data;
};

// Remove bookmark
export const removeBookmarkApi = async (problemId: string) => {
  const res = await API.delete(`/users/bookmarks/${problemId}`);
  return res.data;
};