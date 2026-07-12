import type { Employee } from "./employee.types";

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE" | string;
  employeeId?: string;
  employee?: Employee | null;
  isActive?: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  designation?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
