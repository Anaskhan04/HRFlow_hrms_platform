import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import organizationService from "../services/organization.service";
import type { Organization } from "../types";

export const useOrganizations = () => {
  return useQuery<Organization[], Error>({
    queryKey: ["organizations"],
    queryFn: organizationService.getOrganizations,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Organization>) => organizationService.createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};

export const useUpdateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Organization> }) => organizationService.updateOrganization(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
};
