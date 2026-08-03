import { z } from "zod";

export const notificationTypeEnum = z.enum([
  "LEAVE_APPROVED",
  "LEAVE_REJECTED",
  "LEAVE_APPLIED",
  "PAYROLL_GENERATED",
  "PAYROLL_PAID",
  "DOCUMENT_UPLOADED",
  "SYSTEM",
]);

export const createNotificationSchema = z.object({
  userId: z.string().min(1, "userId is required."),
  type: notificationTypeEnum.default("SYSTEM"),
  title: z.string().min(1).max(200),
  message: z.string().max(2000).optional(),
  entityType: z.string().max(100).optional(),
  entityId: z.string().optional(),
});

export const updateNotificationSchema = z.object({
  isRead: z.boolean().optional(),
});

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
