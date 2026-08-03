import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationService from "../services/notification.service";
import type { Notification } from "../types";

const QUERY_KEY = ["notifications"];

export const useNotifications = (opts: { onlyUnread?: boolean; limit?: number } = {}) => {
  return useQuery<Notification[], Error>({
    queryKey: [...QUERY_KEY, opts],
    queryFn: () => notificationService.list(opts),
    refetchOnWindowFocus: true,
    refetchInterval: 30_000,
    staleTime: 10_000,
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery<number, Error>({
    queryKey: ["notifications", "unread-count"],
    queryFn: notificationService.unreadCount,
    refetchOnWindowFocus: true,
    refetchInterval: 15_000,
    staleTime: 5_000,
  });
};

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation<Notification, Error, string>({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient();
  return useMutation<{ count: number }, Error>({
    mutationFn: notificationService.markAllRead,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
};

export const useDeleteNotification = () => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: notificationService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
};

export const useClearAllNotifications = () => {
  const qc = useQueryClient();
  return useMutation<{ count: number }, Error>({
    mutationFn: notificationService.clearAll,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEY });
      qc.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
};
