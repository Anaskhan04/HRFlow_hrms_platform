import { User } from "@prisma/client";
import { Role } from "@prisma/client";
import authRepository from "../repositories/auth.repository";
import employeeRepository from "../repositories/employee.repository";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from "../validators/auth.validator";
type UserWithoutPassword = Omit<User, "password">;

class AuthService {
  private excludePassword(user: User): UserWithoutPassword {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getMe(userId: string): Promise<UserWithoutPassword> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    return this.excludePassword(user);
  }

  async updateProfile(userId: string, data: UpdateProfileInput): Promise<UserWithoutPassword> {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }

    if (user.employeeId) {
      await employeeRepository.update(user.employeeId, {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.designation && { designation: data.designation }),
      });
    }

    const updatedUser = await authRepository.findById(userId);
    if (!updatedUser) {
      throw new Error("User not found after update.");
    }
    return this.excludePassword(updatedUser);
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
    await authRepository.updatePassword(userId, hashedPassword);
  }

  async register(data: RegisterInput): Promise<{ user: UserWithoutPassword; token: string }> {
    // 1. Employee must exist
    const employee = await employeeRepository.findById(data.employeeId);
    if (!employee) {
      throw new Error("Employee not found.");
    }

    // 2. Employee must not already have a User account
    const existingEmployeeUser = await authRepository.findByEmployeeId(data.employeeId);
    if (existingEmployeeUser) {
      throw new Error("User account for this employee already exists.");
    }

    // 3. Email must be unique
    const existingEmailUser = await authRepository.findByEmail(data.email);
    if (existingEmailUser) {
      throw new Error("User with this email already exists.");
    }

    // 4. Hash password using src/utils/password.ts
    const hashedPassword = await hashPassword(data.password);

    // 5. Create User using Prisma
   const user = await authRepository.create({
  email: data.email,
  password: hashedPassword,
  employeeId: data.employeeId,
  role: Role.EMPLOYEE,
});
    // 6. Generate JWT using src/utils/jwt.ts
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    // 7. Never return password
    return {
      user: this.excludePassword(user),
      token,
    };
  }

  async login(data: LoginInput): Promise<{ user: UserWithoutPassword; token: string }> {
    // 1. Find user by email
    const user = await authRepository.findByEmail(data.email);

    // 2. If user does not exist, return an error
    if (!user) {
      throw new Error("Invalid email or password.");
    }

    // 3. Compare password using password.ts
    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password.");
    }

    // 4. Generate JWT using jwt.ts
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    // 5. Never return password
    // 6. Return user and token
    return {
      user: this.excludePassword(user),
      token,
    };
  }
}

export default new AuthService();
