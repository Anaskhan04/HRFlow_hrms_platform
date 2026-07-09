import apiClient from "./api.client";
import type { Department } from "../types";

export const departmentService = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiClient.get<{ success: boolean; data: Department[] }>("/departments");
    return response.data.data || [];
  },
};

export default departmentService;
