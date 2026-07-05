export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE" | string;
  employeeId?: string;
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
