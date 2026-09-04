import { Request, Response } from "express";
import { Role } from "@prisma/client";
import attendanceService from "../services/attendance.service";
import exportService from "../services/export.service";
import {
  checkInSchema,
  checkOutSchema,
} from "../validators/attendance.validator";
import { asyncHandler } from "../utils/asyncHandler";

const isPrivilegedRole = (role: Role | undefined): boolean => {
  return role === Role.ADMIN || role === Role.HR;
};

const canManageAttendanceForOthers = (role: Role | undefined): boolean => {
  return role === Role.ADMIN;
};

/**
 * Resolves the target employeeId for attendance punch actions (checkIn, checkOut):
 * - ADMIN: may supply an employeeId in the body to clock in/out on behalf of another employee.
 * - HR / MANAGER / EMPLOYEE: always scoped to the authenticated user's own employeeId.
 */
const resolvePunchEmployeeId = (
  req: Request,
  overrideFromBody?: string
): { employeeId?: string } => {
  if (canManageAttendanceForOthers(req.user?.role)) {
    if (overrideFromBody && overrideFromBody.trim() !== "") {
      return { employeeId: overrideFromBody };
    }
    return { employeeId: req.user?.employeeId };
  }

  return { employeeId: req.user?.employeeId };
};

/**
 * Resolves the target employeeId for single-employee attendance read queries (getToday, getHistory):
 * - ADMIN / HR: query parameters take precedence to inspect another employee's record.
 * - MANAGER / EMPLOYEE: always scoped to the authenticated user's own employeeId.
 */
const resolveReadEmployeeId = (
  req: Request,
  overrideFromQuery?: string
): { employeeId?: string } => {
  if (isPrivilegedRole(req.user?.role)) {
    if (overrideFromQuery && overrideFromQuery.trim() !== "") {
      return { employeeId: overrideFromQuery };
    }
    return { employeeId: req.user?.employeeId };
  }

  return { employeeId: req.user?.employeeId };
};

class AttendanceController {
  checkIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = checkInSchema.parse(req.body);
    const { employeeId } = resolvePunchEmployeeId(req, data.employeeId);

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
    const { employeeId } = resolvePunchEmployeeId(req, data.employeeId);

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
    const { employeeId } = resolveReadEmployeeId(
      req,
      req.query.employeeId as string
    );

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
    const { employeeId } = resolveReadEmployeeId(
      req,
      req.query.employeeId as string
    );

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

    // ✅ FIX Bug #2: EMPLOYEE role cannot filter by arbitrary employeeId via query.
    // Only privileged (ADMIN / HR) roles may supply ?employeeId=<other> to filter
    // attendance list for a specific employee. For regular employees, the list
    // is forcibly scoped to their own employeeId (or unfiltered if they have
    // no linked employee record — but that should never happen for EMPLOYEE role).
    let employeeId: string | undefined;
    if (isPrivilegedRole(req.user?.role)) {
      employeeId = req.query.employeeId as string | undefined;
    } else {
      employeeId = req.user?.employeeId;
    }

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
      ...result,
    });
  });

  export = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let employeeId: string | undefined;
    if (isPrivilegedRole(req.user?.role)) {
      employeeId = req.query.employeeId as string | undefined;
    } else {
      employeeId = req.user?.employeeId;
    }

    const queryParams = { 
      ...req.query, 
      employeeId,
    };
    const attendance = await attendanceService.getAllAttendanceForExport(queryParams as any);
    const buffer = await exportService.exportAttendance(attendance);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.xlsx");
    res.send(buffer);
  });
}

export default new AttendanceController();
