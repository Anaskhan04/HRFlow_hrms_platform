import { Request, Response } from "express";
import leaveService from "../services/leave.service";
import {
  createLeaveSchema,
  updateLeaveSchema,
} from "../validators/leave.validator";
import { asyncHandler } from "../utils/asyncHandler";

class LeaveController {
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = createLeaveSchema.parse(req.body);

    const leaveRequest = await leaveService.createLeaveRequest(data as any);

    res.status(201).json({
      success: true,
      message: "Leave request created successfully.",
      data: leaveRequest,
    });
  });

  apply = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const employeeId = req.user?.employeeId || req.body.employeeId;
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
      data as any
    );

    res.status(201).json({
      success: true,
      message: "Leave applied successfully.",
      data: leaveRequest,
    });
  });

  getMyLeaves = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
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

      const leaveRequests = await leaveService.getMyLeaveRequests(employeeId);

      res.status(200).json({
        success: true,
        data: leaveRequests,
      });
    }
  );

  approve = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const approverId = req.user?.userId || req.user?.employeeId;
    const leaveRequest = await leaveService.approveLeaveRequest(
      req.params.id as string,
      approverId
    );

    res.status(200).json({
      success: true,
      message: "Leave request approved successfully.",
      data: leaveRequest,
    });
  });

  reject = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const approverId = req.user?.userId || req.user?.employeeId;
    const leaveRequest = await leaveService.rejectLeaveRequest(
      req.params.id as string,
      approverId
    );

    res.status(200).json({
      success: true,
      message: "Leave request rejected successfully.",
      data: leaveRequest,
    });
  });

  cancel = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const employeeId = req.user?.employeeId || req.body.employeeId;
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
      data as any
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
