import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import employeeService from "../services/employee.service";
import type {
  EmployeeQueryParams,
  PaginatedEmployees,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  Employee,
} from "../types";

export const useEmployees = (params: EmployeeQueryParams = {}) => {
  return useQuery<PaginatedEmployees, Error>({
    queryKey: ["employees", params],
    queryFn: () => employeeService.getEmployees(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1 * 60 * 1000,
  });
};

export const useEmployee = (id?: string) => {
  return useQuery<Employee, Error>({
    queryKey: ["employee", id],
    queryFn: () => employeeService.getEmployeeById(id!),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<Employee, Error, CreateEmployeeInput>({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<Employee, Error, { id: string; data: UpdateEmployeeInput }>({
    mutationFn: ({ id, data }) => employeeService.updateEmployee(id, data),
    onSuccess: (updatedEmployee) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", updatedEmployee.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: employeeService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};
