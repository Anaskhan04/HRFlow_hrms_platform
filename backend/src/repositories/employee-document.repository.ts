import prisma from "../lib/prisma";
import { Prisma, EmployeeDocument, DocumentCategory } from "@prisma/client";

class EmployeeDocumentRepository {
  async create(
    data: Prisma.EmployeeDocumentUncheckedCreateInput
  ): Promise<EmployeeDocument> {
    return prisma.employeeDocument.create({ data });
  }

  async findById(id: string): Promise<EmployeeDocument | null> {
    return prisma.employeeDocument.findUnique({
      where: { id },
      include: { employee: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
  }

  async findByEmployee(
    employeeId: string,
    category?: DocumentCategory
  ): Promise<EmployeeDocument[]> {
    return prisma.employeeDocument.findMany({
      where: { employeeId, ...(category ? { category } : {}) },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(
    id: string,
    data: Prisma.EmployeeDocumentUpdateInput
  ): Promise<EmployeeDocument> {
    return prisma.employeeDocument.update({ where: { id }, data });
  }

  async delete(id: string): Promise<EmployeeDocument> {
    return prisma.employeeDocument.delete({ where: { id } });
  }
}

export default new EmployeeDocumentRepository();
