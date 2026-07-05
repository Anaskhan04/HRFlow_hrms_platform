import apiClient from "./api.client";
import type { AuthResponse, LoginCredentials } from "../types";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("hrflow_token");
    localStorage.removeItem("hrflow_user");
  },

  getCurrentUser: () => {
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
