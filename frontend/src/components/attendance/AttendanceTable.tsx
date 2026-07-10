import React from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  LogIn,
  LogOut,
  UserCheck,
} from "lucide-react";
import type { AttendanceRecord, AttendanceStatus } from "../../types";

interface AttendanceTableProps {
  attendance: AttendanceRecord[];
  isLoading: boolean;
  onCheckOutRecord?: (record: AttendanceRecord) => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendance,
  isLoading,
  onCheckOutRecord,
}) => {
  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case "PRESENT":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Present
          </span>
        );
      case "LATE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertCircle className="h-3.5 w-3.5" />
            Late
          </span>
        );
      case "HALF_DAY":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Clock className="h-3.5 w-3.5" />
            Half Day
          </span>
        );
      case "ABSENT":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-500/20">
            <XCircle className="h-3.5 w-3.5" />
            Absent
          </span>
        );
      case "ON_LEAVE":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Calendar className="h-3.5 w-3.5" />
            On Leave
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-500/10 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 border border-gray-500/20">
            <HelpCircle className="h-3.5 w-3.5" />
            {status}
          </span>
        );
    }
  };

  const formatTime = (timeStr?: string | null) => {
    if (!timeStr) return "-";
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return timeStr;
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border/40 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
              </div>
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-6 w-20 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (attendance.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserCheck className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          No attendance records found
        </h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
          There are currently no attendance entries matching your search or filter
          criteria. Try resetting your filters or recording a new check-in.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3.5">Employee</th>
              <th className="px-6 py-3.5">Date</th>
              <th className="px-6 py-3.5">Check In</th>
              <th className="px-6 py-3.5">Check Out</th>
              <th className="px-6 py-3.5">Working Hours</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Remarks</th>
              {onCheckOutRecord && <th className="px-6 py-3.5 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {attendance.map((record) => {
              const emp = record.employee;
              const fullName = emp
                ? `${emp.firstName} ${emp.lastName}`
                : record.employeeId;
              const initials = emp
                ? `${emp.firstName[0] || ""}${emp.lastName[0] || ""}`.toUpperCase()
                : "EMP";

              return (
                <tr
                  key={record.id}
                  className="group transition-colors hover:bg-muted/40"
                >
                  {/* Employee */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-blue-600 text-xs font-bold text-white shadow-sm">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {fullName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {emp?.employeeCode || record.employeeId}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatDate(record.date)}
                    </div>
                  </td>

                  {/* Check In */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <LogIn className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="font-medium text-foreground">
                        {formatTime(record.checkIn)}
                      </span>
                    </div>
                  </td>

                  {/* Check Out */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <LogOut className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-medium text-foreground">
                        {formatTime(record.checkOut)}
                      </span>
                    </div>
                  </td>

                  {/* Working Hours */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {record.workingHours !== null &&
                    record.workingHours !== undefined ? (
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-foreground">
                        {Number(record.workingHours).toFixed(2)} hrs
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>

                  {/* Remarks */}
                  <td className="px-6 py-4 max-w-xs truncate text-muted-foreground text-xs">
                    {record.remarks || "-"}
                  </td>

                  {/* Action */}
                  {onCheckOutRecord && (
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {record.checkIn && !record.checkOut ? (
                        <button
                          type="button"
                          onClick={() => onCheckOutRecord(record)}
                          className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                        >
                          <LogOut className="h-3 w-3" />
                          Check Out
                        </button>
                      ) : null}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
