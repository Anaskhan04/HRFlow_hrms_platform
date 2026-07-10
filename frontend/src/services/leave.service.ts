import apiClient from "./api.client";
import type {
  LeaveRequest,
  LeaveType,
  CreateLeaveInput,
  LeaveQueryParams,
  PaginatedLeaves,
} from "../types";

export const leaveService = {
  getLeaves: async (params: LeaveQueryParams = {}): Promise<PaginatedLeaves> => {
    const response = await apiClient.get<{ success: boolean; data: LeaveRequest[] }>("/leaves");
    let allLeaves = response.data.data || [];

    // Filter by Search (Employee code, name, email, reason)
    if (params.search && params.search.trim() !== "") {
      const query = params.search.trim().toLowerCase();
      allLeaves = allLeaves.filter((l) => {
        const emp = l.employee;
        const fullName = emp ? `${emp.firstName} ${emp.lastName}`.toLowerCase() : "";
        const empCode = emp?.employeeCode?.toLowerCase() || "";
        const email = emp?.email?.toLowerCase() || "";
        const reason = l.reason?.toLowerCase() || "";
        return (
          fullName.includes(query) ||
          empCode.includes(query) ||
          email.includes(query) ||
          reason.includes(query)
        );
      });
    }

    // Filter by Status
    if (params.status && params.status !== "ALL") {
      allLeaves = allLeaves.filter((l) => l.status === params.status);
    }

    // Filter by LeaveType
    if (params.leaveTypeId && params.leaveTypeId !== "ALL") {
      allLeaves = allLeaves.filter((l) => l.leaveTypeId === params.leaveTypeId);
    }

    // Sorting
    const sortField = params.sort || "createdAt";
    const sortOrder = params.order || "desc";
    allLeaves.sort((a, b) => {
      let valA: any = a[sortField as keyof LeaveRequest];
      let valB: any = b[sortField as keyof LeaveRequest];

      if (sortField === "startDate" || sortField === "createdAt") {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = allLeaves.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIndex = (page - 1) * limit;
    const paginatedLeaves = allLeaves.slice(startIndex, startIndex + limit);

    return {
      leaves: paginatedLeaves,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  getLeaveTypes: async (): Promise<LeaveType[]> => {
    const response = await apiClient.get<{ success: boolean; data: LeaveType[] }>("/leaves/types");
    return response.data.data || [];
  },

  getLeaveById: async (id: string): Promise<LeaveRequest> => {
    const response = await apiClient.get<{ success: boolean; data: LeaveRequest }>(`/leaves/${id}`);
    return response.data.data;
  },

  applyLeave: async (data: CreateLeaveInput): Promise<LeaveRequest> => {
    const response = await apiClient.post<{ success: boolean; data: LeaveRequest }>("/leaves", data);
    return response.data.data;
  },

  approveLeave: async (id: string): Promise<LeaveRequest> => {
    const response = await apiClient.patch<{ success: boolean; data: LeaveRequest }>(`/leaves/${id}/approve`);
    return response.data.data;
  },

  rejectLeave: async (id: string): Promise<LeaveRequest> => {
    const response = await apiClient.patch<{ success: boolean; data: LeaveRequest }>(`/leaves/${id}/reject`);
    return response.data.data;
  },

  cancelLeave: async (id: string, employeeId: string): Promise<LeaveRequest> => {
    const response = await apiClient.patch<{ success: boolean; data: LeaveRequest }>(`/leaves/${id}/cancel`, {
      employeeId,
    });
    return response.data.data;
  },
};

export default leaveService;
