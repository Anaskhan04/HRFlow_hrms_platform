import prisma from "../lib/prisma";

import { Prisma, Employee } from "@prisma/client";

class EmployeeRepository {
  async create(
    data: Prisma.EmployeeUncheckedCreateInput | Prisma.EmployeeCreateInput
  ): Promise<Employee> {
    return prisma.employee.create({
      data,
    });
  }

  async findById(id: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { email },
    });
  }

  async findByEmployeeCode(employeeCode: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { employeeCode },
    });
  }

  async findAll(): Promise<Employee[]> {
    return prisma.employee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(
    id: string,
    data: Prisma.EmployeeUncheckedUpdateInput | Prisma.EmployeeUpdateInput
  ): Promise<Employee> {
    return prisma.employee.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Employee> {
    return prisma.employee.delete({
      where: { id },
    });
  }
}

export default new EmployeeRepository();
