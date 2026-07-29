import apiClient from "./api.client";
import type { Organization } from "../types";

export const organizationService = {
  getOrganizations: async (): Promise<Organization[]> => {
    const response = await apiClient.get<{ success: boolean; data: Organization[] }>("/organizations");
    return response.data.data || [];
  },
  createOrganization: async (data: Partial<Organization>): Promise<Organization> => {
    const response = await apiClient.post<{ success: boolean; data: Organization }>("/organizations", data);
    return response.data.data;
  },
  updateOrganization: async (id: string, data: Partial<Organization>): Promise<Organization> => {
    const response = await apiClient.put<{ success: boolean; data: Organization }>(`/organizations/${id}`, data);
    return response.data.data;
  },
};

export default organizationService;
