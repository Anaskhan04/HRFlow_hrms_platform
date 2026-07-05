import { useQuery } from "@tanstack/react-query";
import dashboardService from "../services/dashboard.service";
import type { DashboardSummary } from "../types";

export const useDashboardSummary = () => {
  return useQuery<DashboardSummary, Error>({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
};
