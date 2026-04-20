import API from "./axios";

export const downloadUsersExportApi = async () => {
  const response = await API.get("/export/users", {
    responseType: "blob",
  });
  return response.data;
};

export const downloadSubmissionsExportApi = async () => {
  const response = await API.get("/export/submissions", {
    responseType: "blob",
  });
  return response.data;
};

export const downloadProblemsExportApi = async () => {
  const response = await API.get("/export/problems", {
    responseType: "blob",
  });
  return response.data;
};