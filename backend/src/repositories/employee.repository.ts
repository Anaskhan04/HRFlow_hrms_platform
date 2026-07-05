import prisma from "../lib/prisma";
import { Prisma, Employee, EmployeeStatus } from "@prisma/client";

export interface EmployeeQueryParams {
  page?: number | string;
  limit?: number | string;
  search?: string;
  department?: string;
  status?: Prisma.EnumEmployeeStatusFilter | EmployeeStatus | string;
  sort?: "joiningDate" | "firstName" | "createdAt" | string;
  order?: "asc" | "desc" | string;
}

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

  async findManyWithPagination(params: EmployeeQueryParams = {}) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 10);
    const skip = (page - 1) * limit;

    const where: Prisma.EmployeeWhereInput = {};

    if (params.search && params.search.trim() !== "") {
      const searchTerm = params.search.trim();
      where.OR = [
        { firstName: { contains: searchTerm, mode: "insensitive" } },
        { lastName: { contains: searchTerm, mode: "insensitive" } },
        { email: { contains: searchTerm, mode: "insensitive" } },
        { employeeCode: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (params.department && params.department.trim() !== "") {
      const dept = params.department.trim();
      where.AND = [
        ...(Array.isArray(where.AND)
          ? where.AND
          : where.AND
          ? [where.AND]
          : []),
        {
          OR: [
            { departmentId: dept },
            { department: { name: { equals: dept, mode: "insensitive" } } },
          ],
        },
      ];
    }

    if (params.status && typeof params.status === "string" && params.status.trim() !== "") {
      where.status = params.status.trim() as EmployeeStatus;
    } else if (params.status) {
      where.status = params.status as any;
    }

    const sortField =
      params.sort === "joiningDate" ||
      params.sort === "firstName" ||
      params.sort === "createdAt"
        ? params.sort
        : "createdAt";
    const sortOrder = params.order === "asc" ? "asc" : "desc";

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortField]: sortOrder,
        },
        include: {
          department: true,
          organization: true,
        },
      }),
      prisma.employee.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
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
