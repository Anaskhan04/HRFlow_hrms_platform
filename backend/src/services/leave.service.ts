import { Prisma, LeaveRequest, LeaveStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import leaveRepository from "../repositories/leave.repository";

class LeaveService {
  private calculateLeaveDays(startDate: string | Date, endDate: string | Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  async createLeaveRequest(
    data: Prisma.LeaveRequestUncheckedCreateInput | Prisma.LeaveRequestCreateInput
  ): Promise<LeaveRequest> {
    // Validate startDate vs endDate
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate as string | Date);
      const end = new Date(data.endDate as string | Date);
      if (start > end) {
        throw new Error("startDate cannot be after endDate.");
      }
    }

    // Validate employee existence
    if ("employeeId" in data && data.employeeId) {
      const employee = await leaveRepository.findEmployeeById(
        data.employeeId as string
      );
      if (!employee) {
        throw new Error("Employee not found.");
      }
    } else {
      throw new Error("employeeId is required.");
    }

    // Validate leaveType existence
    if ("leaveTypeId" in data && data.leaveTypeId) {
      const leaveType = await leaveRepository.findLeaveTypeById(
        data.leaveTypeId as string
      );
      if (!leaveType) {
        throw new Error("LeaveType not found.");
      }
    } else {
      throw new Error("leaveTypeId is required.");
    }

    // Validate leave balance
    if (data.startDate && data.endDate && "employeeId" in data && "leaveTypeId" in data) {
      const requestedDays = this.calculateLeaveDays(data.startDate, data.endDate);
      const balanceRecord = await leaveRepository.findLeaveBalance(
        data.employeeId as string,
        data.leaveTypeId as string
      );

      if (!balanceRecord) {
        throw new Error("No leave balance found for this leave type. Please contact HR.");
      }

      if (balanceRecord.balance < requestedDays) {
        throw new Error(`Insufficient leave balance. You requested ${requestedDays} days, but only have ${balanceRecord.balance} days available.`);
      }
    }

    // Default status = PENDING if not specified
    if (!("status" in data) || !data.status) {
      (data as any).status = LeaveStatus.PENDING;
    }

    return leaveRepository.create(data);
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return leaveRepository.findAll();
  }

  async getLeaveTypes() {
    return leaveRepository.findAllLeaveTypes();
  }

  async getLeaveRequestById(id: string): Promise<LeaveRequest | null> {
    return leaveRepository.findById(id);
  }

  async applyForLeave(
    employeeId: string,
    data: {
      leaveTypeId: string;
      startDate: string | Date;
      endDate: string | Date;
      reason: string;
    }
  ): Promise<LeaveRequest> {
    return this.createLeaveRequest({
      employeeId,
      leaveTypeId: data.leaveTypeId,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: LeaveStatus.PENDING,
    });
  }

  async getMyLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
    return leaveRepository.findByEmployeeId(employeeId);
  }

  async getLeaveBalances(employeeId: string) {
    return leaveRepository.findLeaveBalancesByEmployee(employeeId);
  }

  async approveLeaveRequest(id: string, approverId?: string): Promise<LeaveRequest> {
    const leaveRequest = await leaveRepository.findById(id);

    if (!leaveRequest) {
      throw new Error("Leave request not found.");
    }

    if (leaveRequest.status === LeaveStatus.REJECTED) {
      throw new Error("Rejected leave requests cannot be approved.");
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new Error("Only pending leave requests can be approved.");
    }

    const requestedDays = this.calculateLeaveDays(leaveRequest.startDate, leaveRequest.endDate);

    // Check balance again just in case it changed since application
    const balanceRecord = await leaveRepository.findLeaveBalance(
      leaveRequest.employeeId,
      leaveRequest.leaveTypeId
    );

    if (!balanceRecord || balanceRecord.balance < requestedDays) {
      throw new Error("Insufficient leave balance to approve this request.");
    }

    // ✅ FIX #1: Wrap balance deduction + leave status update in an atomic Prisma transaction
    // If either operation fails, neither is applied.
    const [, updatedLeave] = await prisma.$transaction([
      prisma.leaveBalance.update({
        where: {
          employeeId_leaveTypeId: {
            employeeId: leaveRequest.employeeId,
            leaveTypeId: leaveRequest.leaveTypeId,
          },
        },
        data: {
          balance: { decrement: requestedDays },
          used: { increment: requestedDays },
        },
      }),
      prisma.leaveRequest.update({
        where: { id },
        data: {
          status: LeaveStatus.APPROVED,
          approvedBy: approverId || null,
        },
        include: {
          employee: true,
          leaveType: true,
        },
      }),
    ]);

    return updatedLeave;
  }

  async rejectLeaveRequest(id: string, approverId?: string): Promise<LeaveRequest> {
    const leaveRequest = await leaveRepository.findById(id);

    if (!leaveRequest) {
      throw new Error("Leave request not found.");
    }

    if (leaveRequest.status !== LeaveStatus.PENDING) {
      throw new Error("Only pending leave requests can be rejected.");
    }

    // ✅ Rejection does NOT touch LeaveBalance (balance was never deducted for PENDING requests)
    return leaveRepository.update(id, {
      status: LeaveStatus.REJECTED,
      approvedBy: approverId || null,
    });
  }

  async cancelLeaveRequest(id: string, employeeId: string): Promise<LeaveRequest> {
    const leaveRequest = await leaveRepository.findById(id);

    if (!leaveRequest) {
      throw new Error("Leave request not found.");
    }

    if (leaveRequest.employeeId !== employeeId) {
      throw new Error("You can only cancel your own leave requests.");
    }

    const status = leaveRequest.status;

    if (status !== LeaveStatus.PENDING && status !== LeaveStatus.APPROVED) {
      throw new Error("Only pending or approved leave requests can be cancelled.");
    }

    const requestedDays = this.calculateLeaveDays(leaveRequest.startDate, leaveRequest.endDate);

    // If the leave being cancelled was already APPROVED, we must REFUND the deducted balance
    if (status === LeaveStatus.APPROVED) {
      // ✅ FIX #2: Approved cancellation -> refund balance + used atomically
      const [, updatedLeave] = await prisma.$transaction([
        prisma.leaveBalance.update({
          where: {
            employeeId_leaveTypeId: {
              employeeId: leaveRequest.employeeId,
              leaveTypeId: leaveRequest.leaveTypeId,
            },
          },
          data: {
            balance: { increment: requestedDays },
            used: { decrement: requestedDays },
          },
        }),
        prisma.leaveRequest.update({
          where: { id },
          data: { status: LeaveStatus.CANCELLED },
          include: {
            employee: true,
            leaveType: true,
          },
        }),
      ]);

      return updatedLeave;
    }

    // PENDING -> CANCELLED (balance was never deducted, no refund needed)
    return leaveRepository.update(id, {
      status: LeaveStatus.CANCELLED,
    });
  }

  async updateLeaveRequest(
    id: string,
    data: Prisma.LeaveRequestUncheckedUpdateInput | Prisma.LeaveRequestUpdateInput
  ): Promise<LeaveRequest> {
    const existingLeaveRequest = await leaveRepository.findById(id);

    if (!existingLeaveRequest) {
      throw new Error("LeaveRequest not found.");
    }

    // ✅ FIX #3: Prevent edits to date/type/employee on non-PENDING leaves
    // to avoid LeaveBalance inconsistency.
    if (existingLeaveRequest.status !== LeaveStatus.PENDING) {
      const isModifyingBalanceAffectingFields =
        "startDate" in data ||
        "endDate" in data ||
        ("leaveTypeId" in data && data.leaveTypeId !== existingLeaveRequest.leaveTypeId) ||
        ("employeeId" in data && data.employeeId !== existingLeaveRequest.employeeId);

      if (isModifyingBalanceAffectingFields) {
        throw new Error(
          `Cannot modify startDate, endDate, leaveTypeId, or employeeId on a ${existingLeaveRequest.status} leave request. Cancel and re-apply instead.`
        );
      }
    }

    // Validate startDate vs endDate if updated
    const start = data.startDate
      ? new Date(data.startDate as string | Date)
      : new Date(existingLeaveRequest.startDate);
    const end = data.endDate
      ? new Date(data.endDate as string | Date)
      : new Date(existingLeaveRequest.endDate);

    if (start > end) {
      throw new Error("startDate cannot be after endDate.");
    }

    // Validate employee existence if updated
    if ("employeeId" in data && data.employeeId && data.employeeId !== existingLeaveRequest.employeeId) {
      const employee = await leaveRepository.findEmployeeById(
        data.employeeId as string
      );
      if (!employee) {
        throw new Error("Employee not found.");
      }
    }

    // Validate leaveType existence if updated
    if ("leaveTypeId" in data && data.leaveTypeId && data.leaveTypeId !== existingLeaveRequest.leaveTypeId) {
      const leaveType = await leaveRepository.findLeaveTypeById(
        data.leaveTypeId as string
      );
      if (!leaveType) {
        throw new Error("LeaveType not found.");
      }
    }

    return leaveRepository.update(id, data);
  }

  async deleteLeaveRequest(id: string): Promise<LeaveRequest> {
    const existingLeaveRequest = await leaveRepository.findById(id);

    if (!existingLeaveRequest) {
      throw new Error("LeaveRequest not found.");
    }

    // ✅ FIX #4: If deleting APPROVED leave -> refund balance atomically with deletion
    if (existingLeaveRequest.status === LeaveStatus.APPROVED) {
      const requestedDays = this.calculateLeaveDays(
        existingLeaveRequest.startDate,
        existingLeaveRequest.endDate
      );

      const [, deletedLeave] = await prisma.$transaction([
        prisma.leaveBalance.update({
          where: {
            employeeId_leaveTypeId: {
              employeeId: existingLeaveRequest.employeeId,
              leaveTypeId: existingLeaveRequest.leaveTypeId,
            },
          },
          data: {
            balance: { increment: requestedDays },
            used: { decrement: requestedDays },
          },
        }),
        prisma.leaveRequest.delete({
          where: { id },
          include: {
            employee: true,
            leaveType: true,
          },
        }),
      ]);

      return deletedLeave;
    }

    // Non-approved leaves (PENDING / REJECTED / CANCELLED) -> no balance impact
    return leaveRepository.delete(id);
  }
}

export default new LeaveService();
