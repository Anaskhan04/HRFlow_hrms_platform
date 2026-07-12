import apiClient from "./api.client";
import type {
  AuthResponse,
  LoginCredentials,
  User,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  getMe: async (): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.get<{ success: boolean; data: User }>("/auth/me");
    if (response.data?.data) {
      localStorage.setItem("hrflow_user", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<{ success: boolean; data: User }> => {
    const response = await apiClient.put<{ success: boolean; data: User }>("/auth/profile", payload);
    if (response.data?.data) {
      localStorage.setItem("hrflow_user", JSON.stringify(response.data.data));
    }
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<{ success: boolean; message?: string }> => {
    const response = await apiClient.put<{ success: boolean; message?: string }>("/auth/change-password", payload);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("hrflow_token");
    localStorage.removeItem("hrflow_user");
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("hrflow_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("hrflow_token");
  },
};

export default authService;
