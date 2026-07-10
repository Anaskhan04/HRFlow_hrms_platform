import React from "react";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Ban,
  Calendar,
  Clock,
} from "lucide-react";
import type { LeaveRequest } from "../../types";
import { Button } from "../ui/button";

interface LeaveTableProps {
  leaves: LeaveRequest[];
  isLoading: boolean;
  onView: (leave: LeaveRequest) => void;
  onApprove: (leave: LeaveRequest) => void;
  onReject: (leave: LeaveRequest) => void;
  onCancel: (leave: LeaveRequest) => void;
}

const getDurationDays = (startStr: string, endStr: string): number => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, diffDays);
};

export const LeaveTable: React.FC<LeaveTableProps> = ({
  leaves,
  isLoading,
  onView,
  onApprove,
  onReject,
  onCancel,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border/40 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-56 rounded bg-muted" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-muted" />
              <div className="h-8 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="rounded-xl border bg-card/50 p-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 mb-4 text-indigo-500">
          <Calendar className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Leave Requests Found</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          No employee leave requests match your search or filter criteria. Try clearing filters or applying for a new leave.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3.5">Employee</th>
              <th className="px-6 py-3.5">Leave Type & Reason</th>
              <th className="px-6 py-3.5">Dates & Duration</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {leaves.map((leave) => {
              const emp = leave.employee;
              const fullName = emp ? `${emp.firstName} ${emp.lastName}` : "Unknown Employee";
              const initials = emp
                ? `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`
                : "??";
              const duration = getDurationDays(leave.startDate, leave.endDate);

              return (
                <tr
                  key={leave.id}
                  className="group hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 font-bold text-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-indigo-600 transition-colors">
                          {fullName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {emp?.employeeCode || emp?.email || leave.employeeId}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600">
                        {leave.leaveType?.name || "Leave Request"}
                      </span>
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                        {leave.reason}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      <div className="font-medium text-xs text-foreground">
                        {new Date(leave.startDate).toLocaleDateString()} –{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {duration} {duration === 1 ? "day" : "days"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    {leave.status === "PENDING" && (
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 border border-amber-500/20">
                        Pending
                      </span>
                    )}
                    {leave.status === "APPROVED" && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                        Approved
                      </span>
                    )}
                    {leave.status === "REJECTED" && (
                      <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 border border-rose-500/20">
                        Rejected
                      </span>
                    )}
                    {leave.status === "CANCELLED" && (
                      <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-1 text-xs font-semibold text-slate-500 border border-slate-500/20">
                        Cancelled
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(leave)}
                        title="View Details"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      {leave.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onApprove(leave)}
                            title="Approve Leave"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onReject(leave)}
                            title="Reject Leave"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCancel(leave)}
                            title="Cancel Request"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveTable;
