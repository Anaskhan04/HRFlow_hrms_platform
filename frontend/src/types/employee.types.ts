export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

export interface Department {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  slug?: string;
  email?: string;
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  designation: string;
  joiningDate: string;
  salary?: number | null;
  status: EmployeeStatus;
  organizationId: string;
  departmentId?: string | null;
  department?: Department | null;
  organization?: Organization | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export interface EmployeePaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedEmployees {
  employees: Employee[];
  pagination: EmployeePaginationMeta;
}

export interface PaginatedEmployeesResponse {
  success: boolean;
  data?: PaginatedEmployees;
  employees?: Employee[];
  pagination?: EmployeePaginationMeta;
}

export interface CreateEmployeeInput {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  designation: string;
  joiningDate: string;
  salary?: number;
  status?: EmployeeStatus;
  organizationId: string;
  departmentId?: string;
}

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;
