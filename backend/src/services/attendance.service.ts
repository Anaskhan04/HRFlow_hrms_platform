import { Prisma, Attendance, AttendanceStatus } from "@prisma/client";
import attendanceRepository from "../repositories/attendance.repository";

const getStartOfDay = (date: Date = new Date()): Date => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

class AttendanceService {
  async checkIn(employeeId: string, remarks?: string): Promise<Attendance> {
    const employee = await attendanceRepository.findEmployeeById(employeeId);
    if (!employee) {
      throw new Error("Employee not found.");
    }

    const today = getStartOfDay();
    const existingAttendance = await attendanceRepository.findByEmployeeAndDate(
      employeeId,
      today
    );

    if (existingAttendance) {
      throw new Error("Employee has already checked in today.");
    }

    const now = new Date();
    return attendanceRepository.create({
      employeeId,
      date: today,
      checkIn: now,
      status: AttendanceStatus.PRESENT,
      remarks: remarks || null,
    });
  }

  async checkOut(employeeId: string, remarks?: string): Promise<Attendance> {
    const today = getStartOfDay();
    const attendance = await attendanceRepository.findByEmployeeAndDate(
      employeeId,
      today
    );

    if (!attendance || !attendance.checkIn) {
      throw new Error("Cannot check out before checking in.");
    }

    if (attendance.checkOut) {
      throw new Error("Employee has already checked out today.");
    }

    const now = new Date();
    const checkInTime = new Date(attendance.checkIn).getTime();
    const checkOutTime = now.getTime();
    const diffInHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    const workingHours = parseFloat(diffInHours.toFixed(2));

    const updatedRemarks = remarks
      ? attendance.remarks
        ? `${attendance.remarks} | ${remarks}`
        : remarks
      : undefined;

    return attendanceRepository.update(attendance.id, {
      checkOut: now,
      workingHours,
      remarks: updatedRemarks,
    });
  }

  async getTodayAttendance(employeeId: string): Promise<Attendance | null> {
    const today = getStartOfDay();
    return attendanceRepository.findByEmployeeAndDate(employeeId, today);
  }

  async getAttendanceHistory(employeeId: string): Promise<Attendance[]> {
    return attendanceRepository.findByEmployeeId(employeeId);
  }
}

export default new AttendanceService();
