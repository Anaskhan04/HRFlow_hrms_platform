import prisma from "../lib/prisma";
import { Prisma, User } from "@prisma/client";

class AuthRepository {
  async create(
    data: Prisma.UserUncheckedCreateInput | Prisma.UserCreateInput
  ): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        employee: true,
      },
    });
  }
  
async findByEmailWithPassword(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
  }

  async findByEmployeeId(employeeId: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { employeeId },
    });
  }
}

export default new AuthRepository();
