import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboard.service";
import type { DashboardSummary, DashboardAnalytics } from "../types";

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

export const useDashboardAnalytics = () => {
  return useQuery<DashboardAnalytics, Error>({
    queryKey: ["dashboard", "analytics"],
    queryFn: dashboardService.getAnalytics,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};

