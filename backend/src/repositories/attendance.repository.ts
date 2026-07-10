import prisma from "../lib/prisma";
import { Prisma, Attendance, Employee, AttendanceStatus } from "@prisma/client";
import employeeRepository from "./employee.repository";

class AttendanceRepository {
  async create(
    data: Prisma.AttendanceUncheckedCreateInput | Prisma.AttendanceCreateInput
  ): Promise<Attendance> {
    return prisma.attendance.create({
      data,
      include: {
        employee: true,
      },
    });
  }

  async findByEmployeeAndDate(
    employeeId: string,
    date: Date
  ): Promise<Attendance | null> {
    return prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date,
        },
      },
      include: {
        employee: true,
      },
    });
  }

  async findByEmployeeId(employeeId: string): Promise<Attendance[]> {
    return prisma.attendance.findMany({
      where: { employeeId },
      orderBy: {
        date: "desc",
      },
      include: {
        employee: true,
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
    status?: AttendanceStatus;
    date?: Date;
    employeeId?: string;
  }): Promise<{ attendance: Attendance[]; total: number }> {
    const where: Prisma.AttendanceWhereInput = {};
    if (params.employeeId) {
      where.employeeId = params.employeeId;
    }
    if (params.status) {
      where.status = params.status;
    }
    if (params.date) {
      const start = new Date(params.date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(params.date);
      end.setUTCHours(23, 59, 59, 999);
      where.date = { gte: start, lte: end };
    }
    if (params.search) {
      where.employee = {
        OR: [
          { firstName: { contains: params.search } },
          { lastName: { contains: params.search } },
          { employeeCode: { contains: params.search } },
          { email: { contains: params.search } },
        ],
      };
    }

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { date: "desc" },
        include: {
          employee: true,
        },
      }),
      prisma.attendance.count({ where }),
    ]);

    return { attendance, total };
  }

  async findById(id: string): Promise<Attendance | null> {
    return prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.AttendanceUncheckedUpdateInput | Prisma.AttendanceUpdateInput
  ): Promise<Attendance> {
    return prisma.attendance.update({
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

export default new AttendanceRepository();
