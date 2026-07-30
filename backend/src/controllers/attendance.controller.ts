import { Request, Response } from "express";
import { Role } from "@prisma/client";
import attendanceService from "../services/attendance.service";
import {
  checkInSchema,
  checkOutSchema,
} from "../validators/attendance.validator";
import { asyncHandler } from "../utils/asyncHandler";

const canOverrideEmployeeId = (role: Role | undefined): boolean => {
  return role === Role.ADMIN || role === Role.HR;
};

class AttendanceController {
  checkIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = checkInSchema.parse(req.body);
    let employeeId: string | undefined = req.user?.employeeId;

    if (!employeeId && canOverrideEmployeeId(req.user?.role)) {
      employeeId = data.employeeId || req.body.employeeId;
    }

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
  });

  checkOut = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = checkOutSchema.parse(req.body);
    let employeeId: string | undefined = req.user?.employeeId;

    if (!employeeId && canOverrideEmployeeId(req.user?.role)) {
      employeeId = data.employeeId || req.body.employeeId;
    }

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
  });

  getToday = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let employeeId: string | undefined = req.user?.employeeId;

    if (!employeeId && canOverrideEmployeeId(req.user?.role)) {
      employeeId = (req.query.employeeId as string) || req.body.employeeId;
    }

    if (!employeeId) {
      res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
      return;
    }

    const attendance = await attendanceService.getTodayAttendance(employeeId);

    res.status(200).json({
      success: true,
      data: attendance,
    });
  });

  getHistory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let employeeId: string | undefined = req.user?.employeeId;

    if (!employeeId && canOverrideEmployeeId(req.user?.role)) {
      employeeId = (req.query.employeeId as string) || req.body.employeeId;
    }

    if (!employeeId) {
      res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
      return;
    }

    const history = await attendanceService.getAttendanceHistory(employeeId);

    res.status(200).json({
      success: true,
      data: history,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = req.query.search as string;
    const status = req.query.status as any;
    const date = req.query.date as string;
    const employeeId = req.query.employeeId as string;

    const result = await attendanceService.getAllAttendance({
      page,
      limit,
      search,
      status,
      date,
      employeeId,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}

export default new AttendanceController();
