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
}

export default new PayrollRepository();
