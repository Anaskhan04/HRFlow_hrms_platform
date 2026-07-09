import type { Department } from "./employee.types";

export interface CreateDepartmentInput {
  name: string;
  description?: string;
  organizationId: string;
}

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

export interface DepartmentWithEmployeeCount extends Department {
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    employees: number;
  };
  employees?: any[];
}
