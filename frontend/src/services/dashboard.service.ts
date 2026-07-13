import apiClient from "./api.client";
import type {
  DashboardSummary,
  DashboardSummaryResponse,
  DashboardAnalytics,
  DashboardAnalyticsResponse,
} from "../types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummaryResponse>("/dashboard/summary");
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },

  getAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await apiClient.get<DashboardAnalyticsResponse>("/dashboard/analytics");
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};

export default dashboardService;

