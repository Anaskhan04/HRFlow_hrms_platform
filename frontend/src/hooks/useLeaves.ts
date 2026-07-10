import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import leaveService from "../services/leave.service";
import type {
  LeaveQueryParams,
  PaginatedLeaves,
  CreateLeaveInput,
  LeaveRequest,
  LeaveType,
} from "../types";

export const useLeaves = (params: LeaveQueryParams = {}) => {
  return useQuery<PaginatedLeaves, Error>({
    queryKey: ["leaves", params],
    queryFn: () => leaveService.getLeaves(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1 * 60 * 1000,
  });
};

export const useLeaveTypes = () => {
  return useQuery<LeaveType[], Error>({
    queryKey: ["leaveTypes"],
    queryFn: () => leaveService.getLeaveTypes(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useLeave = (id?: string) => {
  return useQuery<LeaveRequest, Error>({
    queryKey: ["leave", id],
    queryFn: () => leaveService.getLeaveById(id!),
    enabled: !!id,
  });
};

export const useApplyLeave = () => {
  const queryClient = useQueryClient();

  return useMutation<LeaveRequest, Error, CreateLeaveInput>({
    mutationFn: leaveService.applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useApproveLeave = () => {
  const queryClient = useQueryClient();

  return useMutation<LeaveRequest, Error, string>({
    mutationFn: leaveService.approveLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useRejectLeave = () => {
  const queryClient = useQueryClient();

  return useMutation<LeaveRequest, Error, string>({
    mutationFn: leaveService.rejectLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useCancelLeave = () => {
  const queryClient = useQueryClient();

  return useMutation<LeaveRequest, Error, { id: string; employeeId: string }>({
    mutationFn: ({ id, employeeId }) => leaveService.cancelLeave(id, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};
