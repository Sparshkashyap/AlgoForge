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

  export const listMyBookmarksApi = async () => {
    const response = await API.get("/bookmarks/me");
    return response.data;
  };

  export const toggleBookmarkApi = async (problemId: string) => {
    const response = await API.post(`/bookmarks/${problemId}/toggle`);
    return response.data;
  };