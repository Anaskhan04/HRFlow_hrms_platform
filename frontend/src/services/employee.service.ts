import apiClient from "./api.client";
import type {
  Employee,
  EmployeeQueryParams,
  PaginatedEmployees,
  PaginatedEmployeesResponse,
  CreateEmployeeInput,
  UpdateEmployeeInput,
} from "../types";

export const employeeService = {
  getEmployees: async (params: EmployeeQueryParams = {}): Promise<PaginatedEmployees> => {
    // Clean up empty query params
    const cleanParams: Record<string, any> = {};
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;
    if (params.search && params.search.trim() !== "") cleanParams.search = params.search.trim();
    if (params.department && params.department !== "ALL") cleanParams.department = params.department;
    if (params.status && params.status !== "ALL") cleanParams.status = params.status;
    if (params.sort) cleanParams.sort = params.sort;
    if (params.order) cleanParams.order = params.order;

    const response = await apiClient.get<PaginatedEmployeesResponse>("/employees", {
      params: cleanParams,
    });

    if (response.data.data) {
      return response.data.data;
    }
    if (response.data.employees && response.data.pagination) {
      return {
        employees: response.data.employees,
        pagination: response.data.pagination,
      };
    }
    return {
      employees: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  },

  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await apiClient.get<{ success: boolean; data: Employee }>(`/employees/${id}`);
    return response.data.data;
  },

  createEmployee: async (data: CreateEmployeeInput): Promise<Employee> => {
    const response = await apiClient.post<{ success: boolean; data: Employee }>("/employees", data);
    return response.data.data;
  },

  updateEmployee: async (id: string, data: UpdateEmployeeInput): Promise<Employee> => {
    const response = await apiClient.put<{ success: boolean; data: Employee }>(`/employees/${id}`, data);
    return response.data.data;
  },

  deleteEmployee: async (id: string): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },
};

export default employeeService;
