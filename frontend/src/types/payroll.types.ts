import type { Employee } from "./employee.types";

export type PayrollStatus = "PENDING" | "GENERATED" | "PAID";

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  generatedAt?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: Employee | null;
}

export interface GeneratePayrollInput {
  employeeId: string;
  month: number;
  year: number;
  basicSalary?: number;
  allowances?: number;
  deductions?: number;
}

export interface UpdatePayrollInput {
  basicSalary?: number;
  allowances?: number;
  deductions?: number;
  status?: PayrollStatus;
  month?: number;
  year?: number;
}

export interface PayrollQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  month?: number | "ALL";
  year?: number | "ALL";
  status?: PayrollStatus | "ALL";
  employeeId?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedPayrolls {
  payrolls: PayrollRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
