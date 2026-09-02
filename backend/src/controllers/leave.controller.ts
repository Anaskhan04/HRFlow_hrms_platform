import { Request, Response } from "express";
import { Role } from "@prisma/client";
import leaveService from "../services/leave.service";
import exportService from "../services/export.service";
import {
  createLeaveSchema,
  updateLeaveSchema,
} from "../validators/leave.validator";
import { asyncHandler } from "../utils/asyncHandler";

const canOverrideEmployeeId = (role: Role | undefined): boolean => {
  return role === Role.ADMIN || role === Role.HR;
};

class LeaveController {
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = createLeaveSchema.parse(req.body);

    const leaveRequest = await leaveService.createLeaveRequest(data);

    res.status(201).json({
      success: true,
      message: "Leave request created successfully.",
      data: leaveRequest,
    });
  });

  getBalances = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const paramEmployeeId = req.params.employeeId as string;
    const userEmployeeId = req.user?.employeeId;
    const isPrivileged = canOverrideEmployeeId(req.user?.role);

    let employeeId: string | undefined;
    if (isPrivileged) {
      employeeId = paramEmployeeId;
    } else {
      employeeId = userEmployeeId;
      if (paramEmployeeId && employeeId && paramEmployeeId !== employeeId) {
        res.status(403).json({
          success: false,
          message: "Forbidden. You can only view your own leave balances.",
        });
        return;
      }
    }

    if (!employeeId) {
      res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
      return;
    }

    const balances = await leaveService.getLeaveBalances(employeeId);

    res.status(200).json({
      success: true,
      data: balances,
    });
  });

  apply = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let employeeId: string | undefined = req.user?.employeeId;

    if (!employeeId && canOverrideEmployeeId(req.user?.role)) {
      employeeId = req.body.employeeId;
    }

    if (!employeeId) {
      res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
      return;
    }

    const bodyData = {
      ...req.body,
      employeeId,
    };

    const data = createLeaveSchema.parse(bodyData);

    const leaveRequest = await leaveService.applyForLeave(
      employeeId,
      data
    );

    res.status(201).json({
      success: true,
      message: "Leave applied successfully.",
      data: leaveRequest,
    });
  });

  getMyLeaves = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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

      const leaveRequests = await leaveService.getMyLeaveRequests(employeeId);

      res.status(200).json({
        success: true,
        data: leaveRequests,
      });
    }
  );

  approve = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const leaveRequest = await leaveService.approveLeaveRequest(
      req.params.id as string,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Leave request approved successfully.",
      data: leaveRequest,
    });
  });

  reject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const leaveRequest = await leaveService.rejectLeaveRequest(
      req.params.id as string,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Leave request rejected successfully.",
      data: leaveRequest,
    });
  });

  cancel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    let employeeId: string | undefined = req.user?.employeeId;

    if (!employeeId && canOverrideEmployeeId(req.user?.role)) {
      employeeId = req.body.employeeId;
    }

    if (!employeeId) {
      res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
      return;
    }

    const leaveRequest = await leaveService.cancelLeaveRequest(
      req.params.id as string,
      employeeId
    );

    res.status(200).json({
      success: true,
      message: "Leave request cancelled successfully.",
      data: leaveRequest,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const leaveRequests = await leaveService.getLeaveRequests();

    res.status(200).json({
      success: true,
      data: leaveRequests,
    });
  });

  export = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // For export, we reuse getAll logic (we can pass query filters to getLeaveRequests in the future if needed, but currently it just returns all)
    const leaveRequests = await leaveService.getLeaveRequests();
    const buffer = await exportService.exportLeaves(leaveRequests);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=leave-requests.xlsx");
    res.send(buffer);
  });

  getTypes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const leaveTypes = await leaveService.getLeaveTypes();

    res.status(200).json({
      success: true,
      data: leaveTypes,
    });
  });

  getById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const leaveRequest = await leaveService.getLeaveRequestById(
        req.params.id as string
      );

      if (!leaveRequest) {
        res.status(404).json({
          success: false,
          message: "Leave request not found.",
        });
        return;
      }

      const isAdminOrHR = req.user?.role === Role.ADMIN || req.user?.role === Role.HR;
      const isManager = req.user?.role === Role.MANAGER;
      
      if (!isAdminOrHR) {
        if (isManager) {
          const emp = (leaveRequest as any).employee;
          if (leaveRequest.employeeId !== req.user?.employeeId && emp?.departmentId !== req.user?.departmentId) {
            res.status(403).json({
              success: false,
              message: "Forbidden. You can only view leave requests for your own department.",
            });
            return;
          }
        } else if (leaveRequest.employeeId !== req.user?.employeeId) {
          res.status(403).json({
            success: false,
            message: "Forbidden. You can only view your own leave requests.",
          });
          return;
        }
      }

      res.status(200).json({
        success: true,
        data: leaveRequest,
      });
    }
  );

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingLeaveRequest = await leaveService.getLeaveRequestById(
      req.params.id as string
    );

    if (!existingLeaveRequest) {
      res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
      return;
    }

    const data = updateLeaveSchema.parse(req.body);

    const leaveRequest = await leaveService.updateLeaveRequest(
      req.params.id as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Leave request updated successfully.",
      data: leaveRequest,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingLeaveRequest = await leaveService.getLeaveRequestById(
      req.params.id as string
    );

    if (!existingLeaveRequest) {
      res.status(404).json({
        success: false,
        message: "Leave request not found.",
      });
      return;
    }

    await leaveService.deleteLeaveRequest(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Leave request deleted successfully.",
    });
  });
}

export default new LeaveController();
