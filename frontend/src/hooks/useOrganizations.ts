import { useQuery } from "@tanstack/react-query";
import organizationService from "../services/organization.service";
import type { Organization } from "../types";

export const useOrganizations = () => {
  return useQuery<Organization[], Error>({
    queryKey: ["organizations"],
    queryFn: organizationService.getOrganizations,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
