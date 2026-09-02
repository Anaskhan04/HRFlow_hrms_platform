import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service";
import { asyncHandler } from "../utils/asyncHandler";

class DashboardController {
  getSummary = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const summary = await dashboardService.getSummary(req.user as any);

    res.status(200).json({
      success: true,
      data: summary,
      ...summary,
    });
  });

  getAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const analytics = await dashboardService.getAnalytics(req.user as any);

    res.status(200).json({
      success: true,
      data: analytics,
      ...analytics,
    });
  });
}

export default new DashboardController();

