import { Role, User } from "@prisma/client";
import authRepository from "../repositories/auth.repository";
import employeeRepository from "../repositories/employee.repository";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { RegisterInput, LoginInput, ChangePasswordInput } from "../validators/auth.validator";

type UserWithoutPassword = Omit<User, "password">;

class AuthService {
  private excludePassword(user: User): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(data: RegisterInput): Promise<{ user: UserWithoutPassword; token: string }> {
    // Check if email already exists
    const existingEmailUser = await authRepository.findByEmail(data.email);
    if (existingEmailUser) {
      throw new Error("User with this email already exists.");
    }

    // Check if employee exists
    const employee = await employeeRepository.findById(data.employeeId);
    if (!employee) {
      throw new Error("Employee not found.");
    }

    // Check if employee already has an associated user account
    const existingEmployeeUser = await authRepository.findByEmployeeId(data.employeeId);
    if (existingEmployeeUser) {
      throw new Error("User account for this employee already exists.");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await authRepository.create({
      email: data.email,
      password: hashedPassword,
      employeeId: data.employeeId,
      role: (data.role as Role) || "EMPLOYEE",
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    return {
      user: this.excludePassword(user),
      token,
    };
  }

  async login(data: LoginInput): Promise<{ user: UserWithoutPassword; token: string }> {
    const user = await authRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    if (!user.isActive) {
      throw new Error("User account is inactive.");
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    return {
      user: this.excludePassword(user),
      token,
    };
  }

  async getMe(userId: string): Promise<UserWithoutPassword> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    return this.excludePassword(user);
  }

  async changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    const isPasswordValid = await comparePassword(data.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect.");
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await authRepository.update(userId, {
      password: hashedPassword,
    });
  }
}

export default new AuthService();
