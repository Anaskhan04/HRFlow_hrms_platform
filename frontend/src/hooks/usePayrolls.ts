import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { payrollService } from "../services/payroll.service";
import type {
  PayrollQueryParams,
  PaginatedPayrolls,
  PayrollRecord,
  GeneratePayrollInput,
  UpdatePayrollInput,
} from "../types";

export const usePayrollList = (params: PayrollQueryParams = {}) => {
  return useQuery<PaginatedPayrolls, Error>({
    queryKey: ["payrolls", params],
    queryFn: () => payrollService.getPayrollList(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1 * 60 * 1000,
  });
};

export const usePayrollById = (id: string, enabled = true) => {
  return useQuery<PayrollRecord, Error>({
    queryKey: ["payroll", id],
    queryFn: () => payrollService.getPayrollById(id),
    enabled: Boolean(id) && enabled,
    staleTime: 1 * 60 * 1000,
  });
};

export const useGeneratePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation<PayrollRecord, Error, GeneratePayrollInput>({
    mutationFn: payrollService.generatePayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PayrollRecord,
    Error,
    { id: string; data: UpdatePayrollInput }
  >({
    mutationFn: ({ id, data }) => payrollService.updatePayroll(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      queryClient.invalidateQueries({ queryKey: ["payroll", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useDeletePayroll = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: payrollService.deletePayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const usePayPayroll = () => {
  const queryClient = useQueryClient();

  return useMutation<PayrollRecord, Error, string>({
    mutationFn: payrollService.payPayroll,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      queryClient.invalidateQueries({ queryKey: ["payroll", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};
