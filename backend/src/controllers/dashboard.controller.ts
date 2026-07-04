import { Request, Response, NextFunction } from "express";
import dashboardService from "../services/dashboard.service";

class DashboardController {
  async getSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const summary = await dashboardService.getSummary();

      res.status(200).json({
        success: true,
        data: summary,
        ...summary,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
