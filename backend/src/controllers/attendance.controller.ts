import { Request, Response } from "express";
import { Role } from "@prisma/client";
import attendanceService from "../services/attendance.service";
import {
  checkInSchema,
  checkOutSchema,
} from "../validators/attendance.validator";
import { asyncHandler } from "../utils/asyncHandler";

const isPrivilegedRole = (role: Role | undefined): boolean => {
  return role === Role.ADMIN || role === Role.HR;
};

/**
 * Resolves the target employeeId for attendance endpoints with strict RBAC:
 *
 * - ADMIN / HR: body/query parameters take PRECEDENCE over JWT employeeId.
 *   This lets HR/Admin backfill attendance for another employee even when HR
 *   users themselves have a linked employee record in their JWT. If no override
 *   is provided, fall back to the authenticated user's employeeId.
 *
 * - EMPLOYEE / MANAGER: body/query employeeId is ALWAYS IGNORED. Only the
 *   JWT's employeeId (authenticated identity) is used — preventing buddy
 *   punching and unauthorized attendance snooping.
 *
 * @throws 400 if no employeeId can be resolved for either role class.
 */
const resolveEmployeeId = (
  req: Request,
  overrideFromBodyOrQuery?: string
): { employeeId?: string } => {
  const privileged = isPrivilegedRole(req.user?.role);

  if (privileged) {
    if (overrideFromBodyOrQuery && overrideFromBodyOrQuery.trim() !== "") {
      return { employeeId: overrideFromBodyOrQuery };
    }
    return { employeeId: req.user?.employeeId };
  }

  return { employeeId: req.user?.employeeId };
};

class AttendanceController {
  checkIn = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = checkInSchema.parse(req.body);
    const { employeeId } = resolveEmployeeId(req, data.employeeId);

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
    const { employeeId } = resolveEmployeeId(req, data.employeeId);

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
    const { employeeId } = resolveEmployeeId(
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
    const { employeeId } = resolveEmployeeId(
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
    });
  });
}

export default new AttendanceController();
