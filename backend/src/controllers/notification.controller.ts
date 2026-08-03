import { Request, Response } from "express";
import { Role } from "@prisma/client";
import prisma from "../lib/prisma";
import notificationService from "../services/notification.service";
import notificationRepository from "../repositories/notification.repository";
import {
  createNotificationSchema,
  updateNotificationSchema,
} from "../validators/notification.validator";
import { asyncHandler } from "../utils/asyncHandler";

class NotificationController {
  list = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requester = req.user!;
    const onlyUnread = req.query.unread === "true";
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const skip = req.query.skip ? parseInt(req.query.skip as string) : 0;
    const docs = await notificationService.getForUser(requester.userId, {
      onlyUnread,
      limit: Math.min(limit, 200),
      skip,
    });
    res.json({ success: true, data: docs });
  });

  unreadCount = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const requester = req.user!;
      const count = await notificationService.getUnreadCount(requester.userId);
      res.json({ success: true, data: { count } });
    }
  );

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const notif = await notificationService.getById(req.params.id as string);
    if (!notif) {
      res
        .status(404)
        .json({ success: false, message: "Notification not found." });
      return;
    }
    if (!(await notificationService.canAccess(req.user!.role, req.user!.userId, notif.userId))) {
      res.status(403).json({ success: false, message: "Forbidden." });
      return;
    }
    res.json({ success: true, data: notif });
  });

  markRead = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const updated = await notificationService.markAsRead(
        req.params.id as string,
        req.user!.userId
      );
      res.json({
        success: true,
        message: "Notification marked as read.",
        data: updated,
      });
    }
  );

  markAllRead = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await notificationService.markAllAsRead(req.user!.userId);
      res.json({
        success: true,
        message: `Marked ${result.count} notification(s) as read.`,
        data: result,
      });
    }
  );

  remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await notificationService.remove(req.params.id as string, req.user!.userId);
    res.json({ success: true, message: "Notification deleted." });
  });

  clearAll = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const result = await notificationService.clearAllForUser(req.user!.userId);
      res.json({
        success: true,
        message: `Cleared ${result.count} notification(s).`,
        data: result,
      });
    }
  );

  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requester = req.user!;
    if (requester.role !== Role.ADMIN && requester.role !== Role.HR) {
      res
        .status(403)
        .json({ success: false, message: "Only ADMIN or HR may send notifications." });
      return;
    }
    const input = createNotificationSchema.parse(req.body);
    const doc = await notificationService.create(input);
    res.status(201).json({
      success: true,
      message: "Notification sent.",
      data: doc,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const requester = req.user!;
    if (requester.role !== Role.ADMIN && requester.role !== Role.HR) {
      res.status(403).json({ success: false, message: "Forbidden." });
      return;
    }
    const existing = await notificationService.getById(req.params.id as string);
    if (!existing) {
      res
        .status(404)
        .json({ success: false, message: "Notification not found." });
      return;
    }
    const patch = updateNotificationSchema.parse(req.body);
    const updated = await prisma.notification.update({
      where: { id: existing.id },
      data: patch,
    });
    res.json({ success: true, data: updated });
  });
}

export default new NotificationController();
