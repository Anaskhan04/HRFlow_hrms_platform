import apiClient from "./api.client";
import type { Notification } from "../types";

export const notificationService = {
  list: async (params: { onlyUnread?: boolean; limit?: number } = {}): Promise<
    Notification[]
  > => {
    const search: Record<string, string> = {};
    if (params.onlyUnread) search.unread = "true";
    if (params.limit) search.limit = String(params.limit);
    const response = await apiClient.get<{ success: boolean; data: Notification[] }>(
      "/notifications",
      { params: search }
    );
    return response.data.data || [];
  },

  unreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { count: number };
    }>("/notifications/unread-count");
    return response.data.data?.count ?? 0;
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.patch<{ success: true; data: Notification }>(
      `/notifications/${id}/read`
    );
    return response.data.data;
  },

  markAllRead: async (): Promise<{ count: number }> => {
    const response = await apiClient.patch<{
      success: boolean;
      data: { count: number };
    }>("/notifications/read-all");
    return response.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  clearAll: async (): Promise<{ count: number }> => {
    const response = await apiClient.delete<{
      success: boolean;
      data: { count: number };
    }>("/notifications");
    return response.data.data;
  },
};

export default notificationService;
