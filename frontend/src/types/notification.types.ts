export type NotificationType =
  | "LEAVE_APPROVED"
  | "LEAVE_REJECTED"
  | "LEAVE_APPLIED"
  | "PAYROLL_GENERATED"
  | "PAYROLL_PAID"
  | "DOCUMENT_UPLOADED"
  | "SYSTEM";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export const NOTIFICATION_TYPE_META: Record<
  NotificationType,
  { label: string; accent: string }
> = {
  LEAVE_APPROVED:    { label: "Leave Approved",    accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" },
  LEAVE_REJECTED:    { label: "Leave Rejected",    accent: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400" },
  LEAVE_APPLIED:     { label: "New Leave Request", accent: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400" },
  PAYROLL_GENERATED: { label: "Payroll Generated", accent: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400" },
  PAYROLL_PAID:      { label: "Payroll Paid",      accent: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" },
  DOCUMENT_UPLOADED: { label: "Document Uploaded", accent: "text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400" },
  SYSTEM:            { label: "System",            accent: "text-slate-600 bg-slate-50 dark:bg-slate-500/10 dark:text-slate-400" },
};
