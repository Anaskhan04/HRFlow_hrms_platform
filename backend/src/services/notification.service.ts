import {
  Notification,
  NotificationType,
  Role,
} from "@prisma/client";
import prisma from "../lib/prisma";
import notificationRepository from "../repositories/notification.repository";
import { CreateNotificationInput } from "../validators/notification.validator";

class NotificationService {
  async create(input: CreateNotificationInput): Promise<Notification> {
    return notificationRepository.create(input);
  }

  async dispatch(input: CreateNotificationInput): Promise<void> {
    try {
      await notificationRepository.create(input);
    } catch (err) {
      console.warn("[notification.dispatch] failed:", (err as Error).message);
    }
  }

  async getForUser(
    userId: string,
    opts: { onlyUnread?: boolean; limit?: number; skip?: number } = {}
  ): Promise<Notification[]> {
    return notificationRepository.findByUserId(userId, opts);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.countUnread(userId);
  }

  async getById(id: string): Promise<Notification | null> {
    return notificationRepository.findById(id);
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notif = await notificationRepository.findById(id);
    if (!notif) throw new Error("Notification not found.");
    if (notif.userId !== userId)
      throw new Error("Forbidden: this notification belongs to another user.");
    return notificationRepository.update(id, {
      isRead: true,
      readAt: new Date(),
    });
  }

  async markAllAsRead(userId: string): Promise<{ count: number }> {
    return notificationRepository.markAllRead(userId);
  }

  async remove(id: string, userId: string): Promise<Notification> {
    const notif = await notificationRepository.findById(id);
    if (!notif) throw new Error("Notification not found.");
    if (notif.userId !== userId)
      throw new Error("Forbidden: this notification belongs to another user.");
    return notificationRepository.delete(id);
  }

  async clearAllForUser(userId: string): Promise<{ count: number }> {
    return notificationRepository.clearAll(userId);
  }

  async canAccess(
    requesterRole: Role,
    requesterUserId: string,
    targetUserId: string
  ): Promise<boolean> {
    if (requesterRole === "ADMIN" || requesterRole === "HR") return true;
    return requesterUserId === targetUserId;
  }

  async onLeaveApproved(leaveId: string): Promise<void> {
    const leave = await prisma.leaveRequest.findUnique({
      where: { id: leaveId },
      include: {
        employee: { include: { user: true } },
        leaveType: true,
      },
    });
    if (!leave || !leave.employee.user) return;
    await this.dispatch({
      userId: leave.employee.user.id,
      type: "LEAVE_APPROVED" as NotificationType,
      title: "Leave Request Approved",
      message: `Your ${leave.leaveType.name} request (${leave.startDate.toDateString()} – ${leave.endDate.toDateString()}) has been approved.`,
      entityType: "LEAVE_REQUEST",
      entityId: leave.id,
    });
  }

  async onLeaveRejected(leaveId: string): Promise<void> {
    const leave = await prisma.leaveRequest.findUnique({
      where: { id: leaveId },
      include: {
        employee: { include: { user: true } },
        leaveType: true,
      },
    });
    if (!leave || !leave.employee.user) return;
    await this.dispatch({
      userId: leave.employee.user.id,
      type: "LEAVE_REJECTED" as NotificationType,
      title: "Leave Request Rejected",
      message: `Your ${leave.leaveType.name} request (${leave.startDate.toDateString()} – ${leave.endDate.toDateString()}) was rejected. Please contact HR.`,
      entityType: "LEAVE_REQUEST",
      entityId: leave.id,
    });
  }

  async onLeaveApplied(leaveId: string): Promise<void> {
    const leave = await prisma.leaveRequest.findUnique({
      where: { id: leaveId },
      include: {
        employee: true,
        leaveType: true,
      },
    });
    if (!leave) return;
    const reviewers = await prisma.user.findMany({
      where: { role: { in: ["ADMIN", "HR"] }, isActive: true },
      select: { id: true },
    });
    for (const u of reviewers) {
      await this.dispatch({
        userId: u.id,
        type: "LEAVE_APPLIED" as NotificationType,
        title: "New Leave Request",
        message: `${leave.employee.firstName} ${leave.employee.lastName} submitted a ${leave.leaveType.name} request for review.`,
        entityType: "LEAVE_REQUEST",
        entityId: leave.id,
      });
    }
  }

  async onPayrollGenerated(payrollId: string): Promise<void> {
    const payroll = await prisma.payroll.findUnique({
      where: { id: payrollId },
      include: { employee: { include: { user: true } } },
    });
    if (!payroll || !payroll.employee.user) return;
    await this.dispatch({
      userId: payroll.employee.user.id,
      type: "PAYROLL_GENERATED" as NotificationType,
      title: "Payroll Generated",
      message: `Your ${payroll.month}/${payroll.year} payslip has been generated. Net salary: ${payroll.netSalary.toFixed(2)}.`,
      entityType: "PAYROLL",
      entityId: payroll.id,
    });
    const admins = await prisma.user.findMany({
      where: { role: { in: ["ADMIN", "HR"] }, isActive: true },
      select: { id: true },
    });
    for (const u of admins) {
      await this.dispatch({
        userId: u.id,
        type: "PAYROLL_GENERATED" as NotificationType,
        title: "Payroll Run Complete",
        message: `Payroll for ${payroll.employee.firstName} ${payroll.employee.lastName} (${payroll.month}/${payroll.year}) is generated.`,
        entityType: "PAYROLL",
        entityId: payroll.id,
      });
    }
  }

  async onPayrollPaid(payrollId: string): Promise<void> {
    const payroll = await prisma.payroll.findUnique({
      where: { id: payrollId },
      include: { employee: { include: { user: true } } },
    });
    if (!payroll || !payroll.employee.user) return;
    await this.dispatch({
      userId: payroll.employee.user.id,
      type: "PAYROLL_PAID" as NotificationType,
      title: "Payslip Marked as Paid",
      message: `Your ${payroll.month}/${payroll.year} payslip is now marked as PAID. Net amount: ${payroll.netSalary.toFixed(2)}.`,
      entityType: "PAYROLL",
      entityId: payroll.id,
    });
  }
}

export default new NotificationService();
