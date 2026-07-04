import prisma from "../lib/prisma";
import { Prisma, Attendance, Employee } from "@prisma/client";
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
