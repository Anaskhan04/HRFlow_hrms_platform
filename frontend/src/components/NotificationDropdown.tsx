import React, { useRef, useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  CalendarDays,
  DollarSign,
  FileText,
  Info,
  Inbox,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useClearAllNotifications,
} from "../hooks/useNotifications";
import { NOTIFICATION_TYPE_META } from "../types";
import type { Notification } from "../types";

const IconForType = ({ type }: { type: Notification["type"] }) => {
  switch (type) {
    case "LEAVE_APPROVED":
    case "LEAVE_REJECTED":
    case "LEAVE_APPLIED":
      return <CalendarDays className="h-4 w-4" />;
    case "PAYROLL_GENERATED":
    case "PAYROLL_PAID":
      return <DollarSign className="h-4 w-4" />;
    case "DOCUMENT_UPLOADED":
      return <FileText className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

export const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { data: notifications = [], isLoading, refetch } = useNotifications({ limit: 50 });
  const { data: unread = 0 } = useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteOne = useDeleteNotification();
  const clearAll = useClearAllNotifications();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) refetch();
  };

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpen}
        className="relative rounded-full text-muted-foreground hover:text-foreground"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {typeof unread === "number" && unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow ring-2 ring-background">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
        {(!unread || unread === 0) && (
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-[380px] max-w-[95vw] overflow-hidden rounded-2xl border border-slate-200 bg-background shadow-2xl dark:border-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {typeof unread === "number" && unread > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {unread} unread
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-b px-2 py-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending || !unread}
              className="h-8 gap-1.5 text-xs"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
            <div className="flex-1" />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (confirm("Clear all notifications?")) clearAll.mutate();
              }}
              disabled={clearAll.isPending || notifications.length === 0}
              className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <div className="p-6 text-sm text-muted-foreground text-center">
                Loading notifications…
              </div>
            )}
            {!isLoading && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60">
                  <Inbox className="h-5 w-5" />
                </div>
                <p className="font-medium text-foreground">All caught up!</p>
                <p>No new notifications.</p>
              </div>
            )}

            <ul className="divide-y">
              {notifications.map((n) => {
                const meta = NOTIFICATION_TYPE_META[n.type] ?? NOTIFICATION_TYPE_META.SYSTEM;
                return (
                  <li
                    key={n.id}
                    className={`group flex gap-3 px-4 py-3 transition-colors ${
                      n.isRead ? "opacity-70" : "bg-primary/[0.02]"
                    } hover:bg-muted/40`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.accent}`}
                    >
                      <IconForType type={n.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${n.isRead ? "font-normal" : "font-semibold"} text-foreground`}>
                          {n.title}
                        </p>
                        <span className="shrink-0 text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-2 pt-0.5">
                          {new Date(n.createdAt).toLocaleString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                      {n.message && (
                        <p className="mt-0.5 line-clamp-3 text-xs text-muted-foreground">
                          {n.message}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {!n.isRead && (
                          <button
                            onClick={() => markRead.mutate(n.id)}
                            disabled={markRead.isPending}
                            className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-foreground hover:bg-muted dark:border-slate-700"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("Delete this notification?")) deleteOne.mutate(n.id);
                          }}
                          disabled={deleteOne.isPending}
                          className="rounded-md border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-destructive hover:bg-destructive/10 dark:border-slate-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
