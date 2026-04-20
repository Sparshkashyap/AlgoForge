import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// optional but useful: handle global errors cleanly
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // basic normalization (don’t over-engineer)
    if (error.response) {
      // server responded with error
      return Promise.reject(error.response);
    }

    if (error.request) {
      // no response (network issue)
      return Promise.reject({
        message: "Network error. Server not reachable.",
      });
    }

    return Promise.reject(error);
  }
);

export default API;