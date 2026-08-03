import prisma from "../lib/prisma";
import { Prisma, Notification } from "@prisma/client";

class NotificationRepository {
  async create(
    data: Prisma.NotificationUncheckedCreateInput
  ): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({ where: { id } });
  }

  async findByUserId(
    userId: string,
    opts: {
      onlyUnread?: boolean;
      limit?: number;
      skip?: number;
    } = {}
  ): Promise<Notification[]> {
    const where: Prisma.NotificationWhereInput = { userId };
    if (opts.onlyUnread) where.isRead = false;
    return prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: opts.limit,
      skip: opts.skip,
    });
  }

  async countUnread(userId: string): Promise<number> {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async update(
    id: string,
    data: Prisma.NotificationUpdateInput
  ): Promise<Notification> {
    return prisma.notification.update({ where: { id }, data });
  }

  async markAllRead(userId: string): Promise<{ count: number }> {
    const res = await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    return { count: res.count };
  }

  async delete(id: string): Promise<Notification> {
    return prisma.notification.delete({ where: { id } });
  }

  async clearAll(userId: string): Promise<{ count: number }> {
    const res = await prisma.notification.deleteMany({ where: { userId } });
    return { count: res.count };
  }
}

export default new NotificationRepository();
