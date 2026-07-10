import prisma from "../lib/prisma";
import { Prisma, LeaveRequest, LeaveType, Employee } from "@prisma/client";
import employeeRepository from "./employee.repository";

class LeaveRepository {
  async create(
    data: Prisma.LeaveRequestUncheckedCreateInput | Prisma.LeaveRequestCreateInput
  ): Promise<LeaveRequest> {
    return prisma.leaveRequest.create({
      data,
    });
  }

  async findAll(): Promise<LeaveRequest[]> {
    return prisma.leaveRequest.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employee: true,
        leaveType: true,
      },
    });
  }

  async findById(id: string): Promise<LeaveRequest | null> {
    return prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: true,
        leaveType: true,
      },
    });
  }

  async findByEmployeeId(employeeId: string): Promise<LeaveRequest[]> {
    return prisma.leaveRequest.findMany({
      where: { employeeId },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        employee: true,
        leaveType: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.LeaveRequestUncheckedUpdateInput | Prisma.LeaveRequestUpdateInput
  ): Promise<LeaveRequest> {
    return prisma.leaveRequest.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<LeaveRequest> {
    return prisma.leaveRequest.delete({
      where: { id },
    });
  }

  async findLeaveTypeById(id: string): Promise<LeaveType | null> {
    return prisma.leaveType.findUnique({
      where: { id },
    });
  }

  async findAllLeaveTypes(): Promise<LeaveType[]> {
    return prisma.leaveType.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findEmployeeById(id: string): Promise<Employee | null> {
    return employeeRepository.findById(id);
  }
}

export default new LeaveRepository();
