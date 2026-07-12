import prisma from "../lib/prisma";
import { Prisma, Payroll, Employee } from "@prisma/client";
import employeeRepository from "./employee.repository";

class PayrollRepository {
  async create(
    data: Prisma.PayrollUncheckedCreateInput | Prisma.PayrollCreateInput
  ): Promise<Payroll> {
    return prisma.payroll.create({
      data,
      include: {
        employee: true,
      },
    });
  }

  async findAll(): Promise<Payroll[]> {
    return prisma.payroll.findMany({
      orderBy: [
        { year: "desc" },
        { month: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        employee: true,
      },
    });
  }

  async findById(id: string): Promise<Payroll | null> {
    return prisma.payroll.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
  }

  async findByEmployeeMonthYear(
    employeeId: string,
    month: number,
    year: number
  ): Promise<Payroll | null> {
    return prisma.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month,
          year,
        },
      },
      include: {
        employee: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.PayrollUncheckedUpdateInput | Prisma.PayrollUpdateInput
  ): Promise<Payroll> {
    return prisma.payroll.update({
      where: { id },
      data,
      include: {
        employee: true,
      },
    });
  }

  async findEmployeeById(id: string): Promise<Employee | null> {
    return employeeRepository.findById(id);
  }

  async findAllPaginated(params: {
    skip?: number;
    take?: number;
    search?: string;
    month?: number;
    year?: number;
    status?: any;
    employeeId?: string;
  }): Promise<{ payrolls: Payroll[]; total: number }> {
    const where: Prisma.PayrollWhereInput = {};
    if (params.employeeId) {
      where.employeeId = params.employeeId;
    }
    if (params.month !== undefined && !isNaN(params.month)) {
      where.month = params.month;
    }
    if (params.year !== undefined && !isNaN(params.year)) {
      where.year = params.year;
    }
    if (params.status && params.status !== "ALL") {
      where.status = params.status;
    }
    if (params.search) {
      where.employee = {
        OR: [
          { firstName: { contains: params.search, mode: "insensitive" } },
          { lastName: { contains: params.search, mode: "insensitive" } },
          { employeeCode: { contains: params.search, mode: "insensitive" } },
          { email: { contains: params.search, mode: "insensitive" } },
        ],
      };
    }

    let orderBy: any = [
      { year: "desc" },
      { month: "desc" },
      { createdAt: "desc" },
    ];
    if (params.sort) {
      const order = params.order === "asc" ? "asc" : "desc";
      if (params.sort === "netSalary") {
        orderBy = { netSalary: order };
      } else if (params.sort === "month" || params.sort === "yearMonth") {
        orderBy = [{ year: order }, { month: order }];
      } else if (params.sort === "status") {
        orderBy = { status: order };
      } else if (params.sort === "employeeName") {
        orderBy = { employee: { firstName: order } };
      } else if (params.sort === "createdAt") {
        orderBy = { createdAt: order };
      }
    }

    const [payrolls, total] = await Promise.all([
      prisma.payroll.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy,
        include: {
          employee: true,
        },
      }),
      prisma.payroll.count({ where }),
    ]);

    return { payrolls, total };

  }

  async delete(id: string): Promise<Payroll> {
    return prisma.payroll.delete({
      where: { id },
      include: {
        employee: true,
      },
    });
  }
}

export default new PayrollRepository();

