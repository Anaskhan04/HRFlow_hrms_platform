import { Request, Response, NextFunction } from "express";
import attendanceService from "../services/attendance.service";
import {
  checkInSchema,
  checkOutSchema,
} from "../validators/attendance.validator";

class AttendanceController {
  async checkIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = checkInSchema.parse(req.body);
      const employeeId =
        req.user?.employeeId || data.employeeId || req.body.employeeId;

      if (!employeeId) {
        res.status(400).json({
          success: false,
          message: "Employee ID is required.",
        });
        return;
      }

      const attendance = await attendanceService.checkIn(
        employeeId,
        data.remarks
      );

      res.status(201).json({
        success: true,
        message: "Checked in successfully.",
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async checkOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = checkOutSchema.parse(req.body);
      const employeeId =
        req.user?.employeeId || data.employeeId || req.body.employeeId;

      if (!employeeId) {
        res.status(400).json({
          success: false,
          message: "Employee ID is required.",
        });
        return;
      }

      const attendance = await attendanceService.checkOut(
        employeeId,
        data.remarks
      );

      res.status(200).json({
        success: true,
        message: "Checked out successfully.",
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async getToday(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const employeeId =
        req.user?.employeeId ||
        (req.query.employeeId as string) ||
        req.body.employeeId;

      if (!employeeId) {
        res.status(400).json({
          success: false,
          message: "Employee ID is required.",
        });
        return;
      }

      const attendance = await attendanceService.getTodayAttendance(
        employeeId
      );

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      next(error);
    }
  }

  async getHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const employeeId =
        req.user?.employeeId ||
        (req.query.employeeId as string) ||
        req.body.employeeId;

      if (!employeeId) {
        res.status(400).json({
          success: false,
          message: "Employee ID is required.",
        });
        return;
      }

      const history = await attendanceService.getAttendanceHistory(
        employeeId
      );

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AttendanceController();
