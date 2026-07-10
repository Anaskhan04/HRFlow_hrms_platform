import apiClient from "./api.client";
import type {
  AttendanceRecord,
  CheckInInput,
  CheckOutInput,
  AttendanceQueryParams,
  PaginatedAttendance,
} from "../types";

export const attendanceService = {
  getAttendanceList: async (
    params: AttendanceQueryParams = {}
  ): Promise<PaginatedAttendance> => {
    let allRecords: AttendanceRecord[] = [];

    try {
      const response = await apiClient.get<any>("/attendance", {
        params: {
          search: params.search,
          status: params.status !== "ALL" ? params.status : undefined,
          date: params.date,
          employeeId: params.employeeId,
          page: params.page,
          limit: params.limit,
        },
      });

      if (response.data?.data?.attendance) {
        return response.data.data;
      } else if (Array.isArray(response.data?.data)) {
        allRecords = response.data.data;
      }
    } catch {
      // Fallback to history if /attendance endpoint fails
      const fallbackResponse = await apiClient.get<{
        success: boolean;
        data: AttendanceRecord[];
      }>("/attendance/history");
      allRecords = fallbackResponse.data.data || [];
    }

    // Client-side filtering fallback
    if (params.search && params.search.trim() !== "") {
      const query = params.search.trim().toLowerCase();
      allRecords = allRecords.filter((r) => {
        const emp = r.employee;
        const fullName = emp
          ? `${emp.firstName} ${emp.lastName}`.toLowerCase()
          : "";
        const empCode = emp?.employeeCode?.toLowerCase() || "";
        const email = emp?.email?.toLowerCase() || "";
        const remarks = r.remarks?.toLowerCase() || "";
        return (
          fullName.includes(query) ||
          empCode.includes(query) ||
          email.includes(query) ||
          remarks.includes(query)
        );
      });
    }

    if (params.status && params.status !== "ALL") {
      allRecords = allRecords.filter((r) => r.status === params.status);
    }

    if (params.date && params.date.trim() !== "") {
      allRecords = allRecords.filter((r) => {
        const recordDate = new Date(r.date).toISOString().split("T")[0];
        return recordDate === params.date;
      });
    }

    // Sort descending by date
    allRecords.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = allRecords.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedRecords = allRecords.slice(
      startIndex,
      startIndex + limit
    );

    return {
      attendance: paginatedRecords,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  getTodayAttendance: async (
    employeeId?: string
  ): Promise<AttendanceRecord | null> => {
    const response = await apiClient.get<{
      success: boolean;
      data: AttendanceRecord | null;
    }>("/attendance/today", {
      params: employeeId ? { employeeId } : undefined,
    });
    return response.data.data;
  },

  checkIn: async (input: CheckInInput): Promise<AttendanceRecord> => {
    const response = await apiClient.post<{
      success: boolean;
      data: AttendanceRecord;
    }>("/attendance/check-in", input);
    return response.data.data;
  },

  checkOut: async (input: CheckOutInput): Promise<AttendanceRecord> => {
    const response = await apiClient.patch<{
      success: boolean;
      data: AttendanceRecord;
    }>("/attendance/check-out", input);
    return response.data.data;
  },
};
