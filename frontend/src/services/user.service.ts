import API from "@/api/axios";

export const getMyProfileApi = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const updateMyProfileApi = async (payload: {
  name?: string;
  email?: string;
}) => {
  const res = await API.patch("/users/me", payload);
  return res.data;
};

export const uploadAvatarApi = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await API.post("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const getDailyQuestionApi = async () => {
  const res = await API.get("/users/daily-question");
  return res.data;
};

export const getLeaderboardApi = async () => {
  const res = await API.get("/users/leaderboard");
  return res.data;
};

export const getBookmarksApi = async () => {
  const res = await API.get("/users/bookmarks");
  return res.data;
};

export const addBookmarkApi = async (problemId: string) => {
  const res = await API.post("/users/bookmarks", { problemId });
  return res.data;
};

export const removeBookmarkApi = async (problemId: string) => {
  const res = await API.delete(`/users/bookmarks/${problemId}`);
  return res.data;
};