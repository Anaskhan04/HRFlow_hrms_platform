import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authService from "../services/auth.service";
import type { User, UpdateProfilePayload, ChangePasswordPayload } from "../types";

export const useMyProfile = () => {
  return useQuery<{ success: boolean; data: User }, Error>({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getMe(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: User }, Error, UpdateProfilePayload>({
    mutationFn: (payload) => authService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation<{ success: boolean; message?: string }, Error, ChangePasswordPayload>({
    mutationFn: (payload) => authService.changePassword(payload),
  });
};
