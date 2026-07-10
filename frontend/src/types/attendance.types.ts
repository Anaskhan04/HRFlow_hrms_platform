import type { Employee } from "./employee.types";

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "ON_LEAVE"
  | "LATE";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: AttendanceStatus;
  workingHours?: number | null;
  remarks?: string | null;
  createdAt?: string;
  updatedAt?: string;
  employee?: Employee | null;
}

export interface CheckInInput {
  employeeId?: string;
  remarks?: string;
}

export interface CheckOutInput {
  employeeId?: string;
  remarks?: string;
}

export interface AttendanceQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AttendanceStatus | "ALL";
  date?: string;
  employeeId?: string;
}

export interface PaginatedAttendance {
  attendance: AttendanceRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
