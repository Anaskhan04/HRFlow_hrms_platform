import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";
import type {
  AttendanceQueryParams,
  PaginatedAttendance,
  AttendanceRecord,
  CheckInInput,
  CheckOutInput,
} from "../types";

export const useAttendanceList = (params: AttendanceQueryParams = {}) => {
  return useQuery<PaginatedAttendance, Error>({
    queryKey: ["attendance", params],
    queryFn: () => attendanceService.getAttendanceList(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1 * 60 * 1000,
  });
};

export const useTodayAttendance = (employeeId?: string) => {
  return useQuery<AttendanceRecord | null, Error>({
    queryKey: ["attendanceToday", employeeId],
    queryFn: () => attendanceService.getTodayAttendance(employeeId),
    staleTime: 1 * 60 * 1000,
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation<AttendanceRecord, Error, CheckInInput>({
    mutationFn: attendanceService.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendanceToday"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation<AttendanceRecord, Error, CheckOutInput>({
    mutationFn: attendanceService.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      queryClient.invalidateQueries({ queryKey: ["attendanceToday"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] });
    },
  });
};
