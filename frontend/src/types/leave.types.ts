import type { Employee } from "./employee.types";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface LeaveType {
  id: string;
  name: string;
  description?: string | null;
  organizationId: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  employee?: Employee | null;
  leaveType?: LeaveType | null;
}

export interface CreateLeaveInput {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveInput {
  employeeId?: string;
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  status?: LeaveStatus;
}

export interface LeaveQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  leaveTypeId?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedLeaves {
  leaves: LeaveRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
