import apiClient from "./api.client";
import type {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "../types";

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get<{ success: boolean; data: Department[] }>("/departments");
    return response.data.data || [];
  },

  getDepartmentById: async (id: string): Promise<Department> => {
    const response = await apiClient.get<{ success: boolean; data: Department }>(`/departments/${id}`);
    return response.data.data;
  },

  createDepartment: async (data: CreateDepartmentInput): Promise<Department> => {
    const response = await apiClient.post<{ success: boolean; data: Department }>("/departments", data);
    return response.data.data;
  },

  updateDepartment: async (id: string, data: UpdateDepartmentInput): Promise<Department> => {
    const response = await apiClient.put<{ success: boolean; data: Department }>(`/departments/${id}`, data);
    return response.data.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },
};

export default departmentService;
