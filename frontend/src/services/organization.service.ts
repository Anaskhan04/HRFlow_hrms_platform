import apiClient from "./api.client";
import type { Organization } from "../types";

export const organizationService = {
  getOrganizations: async (): Promise<Organization[]> => {
    const response = await apiClient.get<{ success: boolean; data: Organization[] }>("/organizations");
    return response.data.data || [];
  },
};

export default organizationService;
