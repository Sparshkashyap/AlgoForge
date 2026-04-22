import axios from "axios";

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const normalizedBaseUrl = rawBaseUrl.endsWith("/api")
  ? rawBaseUrl
  : `${rawBaseUrl.replace(/\/+$/, "")}/api`;

const API = axios.create({
  baseURL: normalizedBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error);
    }

    if (error.request) {
      return Promise.reject({
        ...error,
        message: "Network error. Server not reachable.",
      });
    }

    return Promise.reject(error);
  }
);

export default API;