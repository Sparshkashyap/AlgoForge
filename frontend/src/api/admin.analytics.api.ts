import API from "./axios";

export const getAdminRevenueAnalyticsApi = async () => {
  const response = await API.get("/admin/analytics/revenue");
  return response.data;
};

export const getAdminSalesChartApi = async () => {
  const response = await API.get("/admin/analytics/sales-chart");
  return response.data;
};

// alias for reuse (same endpoint)
export const getSalesChartApi = async () => {
  const response = await API.get("/admin/analytics/sales-chart");
  return response.data;
};