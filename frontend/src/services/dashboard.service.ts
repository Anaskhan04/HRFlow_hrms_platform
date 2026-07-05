import apiClient from "./api.client";
import type { DashboardSummary, DashboardSummaryResponse } from "../types";

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<DashboardSummaryResponse>("/dashboard/summary");
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
};

export default dashboardService;
