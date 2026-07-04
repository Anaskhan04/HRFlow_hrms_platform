import prisma from "../lib/prisma";
import {
  EmployeeStatus,
  AttendanceStatus,
  LeaveStatus,
} from "@prisma/client";

class DashboardRepository {
  async getSummaryStats(
    today: Date,
    now: Date,
    month: number,
    year: number
  ) {
    const [
      totalEmployees,
      activeEmployees,
      departments,
      todayPresent,
      attendanceOnLeave,
      leaveRequestOnLeave,
      pendingLeaveRequests,
      payrollAggregate,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({ where: { status: EmployeeStatus.ACTIVE } }),
      prisma.department.count(),
      prisma.attendance.count({
        where: { date: today, status: AttendanceStatus.PRESENT },
      }),
      prisma.attendance.count({
        where: { date: today, status: AttendanceStatus.ON_LEAVE },
      }),
      prisma.leaveRequest.count({
        where: {
          status: LeaveStatus.APPROVED,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      }),
      prisma.leaveRequest.count({ where: { status: LeaveStatus.PENDING } }),
      prisma.payroll.aggregate({
        _sum: { netSalary: true },
        where: { month, year },
      }),
    ]);

    const todayOnLeave = Math.max(attendanceOnLeave, leaveRequestOnLeave);
    const monthlyPayroll = payrollAggregate._sum.netSalary || 0;

    return {
      totalEmployees,
      activeEmployees,
      departments,
      todayPresent,
      todayOnLeave,
      pendingLeaveRequests,
      monthlyPayroll,
    };
  }
}

export default new DashboardRepository();
