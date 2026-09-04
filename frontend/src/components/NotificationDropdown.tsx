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
          <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-[400px] max-w-[95vw] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-border/80 px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
              {typeof unread === "number" && unread > 0 && (
                <span className="rounded-full bg-primary/15 text-primary border border-primary/25 px-2 py-0.5 text-xs font-semibold">
                  {unread} unread
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-border/80 px-3 py-2 bg-muted/15">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending || !unread}
              className="h-7 px-2.5 gap-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <CheckCheck className="h-3.5 w-3.5 text-primary" />
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
              className="h-7 px-2.5 gap-1.5 text-xs font-medium text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading && (
              <div className="p-8 text-sm text-muted-foreground text-center">
                Loading notifications…
              </div>
            )}
            {!isLoading && notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2.5 p-10 text-center text-sm text-muted-foreground">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border/80 text-muted-foreground">
                  <Inbox className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-0.5">No notifications right now.</p>
                </div>
              </div>
            )}

            <ul className="divide-y divide-border/60">
              {notifications.map((n) => {
                const meta = NOTIFICATION_TYPE_META[n.type] ?? NOTIFICATION_TYPE_META.SYSTEM;
                return (
                  <li
                    key={n.id}
                    className={`group relative flex gap-3 px-4 py-3.5 transition-colors ${
                      n.isRead
                        ? "bg-transparent hover:bg-muted/40"
                        : "bg-primary/[0.04] dark:bg-primary/[0.08] hover:bg-primary/[0.08] dark:hover:bg-primary/[0.14]"
                    }`}
                  >
                    {!n.isRead && (
                      <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
                    )}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs ${meta.accent}`}
                    >
                      <IconForType type={n.type} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug ${
                            n.isRead
                              ? "font-medium text-foreground/80 dark:text-foreground/85"
                              : "font-bold text-foreground"
                          }`}
                        >
                          {n.title}
                        </p>
                        <span className="shrink-0 text-[11px] font-medium text-muted-foreground whitespace-nowrap pt-0.5">
                          {new Date(n.createdAt).toLocaleString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                      </div>
                      {n.message && (
                        <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                          {n.message}
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        {!n.isRead && (
                          <button
                            onClick={() => markRead.mutate(n.id)}
                            disabled={markRead.isPending}
                            className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (confirm("Delete this notification?")) deleteOne.mutate(n.id);
                          }}
                          disabled={deleteOne.isPending}
                          className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-destructive shadow-2xs hover:bg-destructive/10 transition-colors cursor-pointer"
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
