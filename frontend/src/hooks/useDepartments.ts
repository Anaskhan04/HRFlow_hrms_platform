import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import departmentService from "../services/department.service";
import type {
  Department,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from "../types";

export const useDepartments = () => {
  return useQuery<Department[], Error>({
    queryKey: ["departments"],
    queryFn: departmentService.getDepartments,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<Department, Error, CreateDepartmentInput>({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<Department, Error, { id: string; data: UpdateDepartmentInput }>({
    mutationFn: ({ id, data }) => departmentService.updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: departmentService.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};
