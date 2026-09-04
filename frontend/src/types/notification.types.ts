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
  LEAVE_APPROVED:    { label: "Leave Approved",    accent: "text-emerald-700 bg-emerald-50 border border-emerald-200/80 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30" },
  LEAVE_REJECTED:    { label: "Leave Rejected",    accent: "text-rose-700 bg-rose-50 border border-rose-200/80 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30" },
  LEAVE_APPLIED:     { label: "New Leave Request", accent: "text-amber-700 bg-amber-50 border border-amber-200/80 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30" },
  PAYROLL_GENERATED: { label: "Payroll Generated", accent: "text-indigo-700 bg-indigo-50 border border-indigo-200/80 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30" },
  PAYROLL_PAID:      { label: "Payroll Paid",      accent: "text-emerald-700 bg-emerald-50 border border-emerald-200/80 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30" },
  DOCUMENT_UPLOADED: { label: "Document Uploaded", accent: "text-sky-700 bg-sky-50 border border-sky-200/80 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30" },
  SYSTEM:            { label: "System",            accent: "text-slate-700 bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700" },
};
