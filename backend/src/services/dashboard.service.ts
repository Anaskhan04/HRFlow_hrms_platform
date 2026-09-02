import dashboardRepository from "../repositories/dashboard.repository";
import { TokenPayload } from "../utils/jwt";

const getStartOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

class DashboardService {
  async getSummary(user: TokenPayload) {
    const now = new Date();
    const today = getStartOfDay(now);
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    return dashboardRepository.getSummaryStats(today, now, month, year, user);
  }

  async getAnalytics(user: TokenPayload) {
    return dashboardRepository.getAnalyticsStats(user);
  }
}

export default new DashboardService();

