import prisma from "../lib/prisma";

import { Prisma, Department } from "@prisma/client";

class DepartmentRepository {
  async create(
    data: Prisma.DepartmentUncheckedCreateInput | Prisma.DepartmentCreateInput
  ): Promise<Department> {
    return prisma.department.create({
      data,
    });
  }

  async findById(id: string): Promise<Department | null> {
    return prisma.department.findUnique({
      where: { id },
    });
  }

  async findByNameAndOrganization(
    name: string,
    organizationId: string
  ): Promise<Department | null> {
    return prisma.department.findFirst({
      where: {
        name,
        organizationId,
      },
    });
  }

  async findAll(): Promise<Department[]> {
    return prisma.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(
    id: string,
    data: Prisma.DepartmentUncheckedUpdateInput | Prisma.DepartmentUpdateInput
  ): Promise<Department> {
    return prisma.department.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Department> {
    return prisma.department.delete({
      where: { id },
    });
  }
}

export default new DepartmentRepository();
