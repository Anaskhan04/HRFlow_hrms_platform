import React from "react";
import {
  User,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  Ban,
  Mail,
} from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import type { LeaveRequest } from "../../types";

interface ViewLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveRequest | null;
  onApprove?: (leave: LeaveRequest) => void;
  onReject?: (leave: LeaveRequest) => void;
  onCancel?: (leave: LeaveRequest) => void;
}

const getDurationDays = (startStr: string, endStr: string): number => {
  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;
  const diffTime = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
};

export const ViewLeaveModal: React.FC<ViewLeaveModalProps> = ({
  isOpen,
  onClose,
  leave,
  onApprove,
  onReject,
  onCancel,
}) => {
  if (!leave) return null;

  const emp = leave.employee;
  const duration = getDurationDays(leave.startDate, leave.endDate);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Request Details"
      description={`Reference ID: #${leave.id.slice(0, 8)}`}
    >
      <div className="space-y-6 pt-2">
        {/* Status Header */}
        <div className="flex items-center justify-between rounded-xl bg-muted/40 p-4 border border-border/60">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Current Status
            </span>
            <div className="flex items-center gap-2">
              {leave.status === "PENDING" && (
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 border border-amber-500/20">
                  Pending Review
                </span>
              )}
              {leave.status === "APPROVED" && (
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                  Approved
                </span>
              )}
              {leave.status === "REJECTED" && (
                <span className="inline-flex items-center rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 border border-rose-500/20">
                  Rejected
                </span>
              )}
              {leave.status === "CANCELLED" && (
                <span className="inline-flex items-center rounded-full bg-slate-500/10 px-3 py-1 text-xs font-bold text-slate-500 border border-slate-500/20">
                  Cancelled
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Leave Category
            </span>
            <div className="font-bold text-sm text-indigo-600">
              {leave.leaveType?.name || "Statutory Leave"}
            </div>
          </div>
        </div>

        {/* Employee Info Box */}
        <div className="rounded-xl border border-border/60 p-4 space-y-3 bg-card">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <User className="h-3.5 w-3.5 text-indigo-500" />
            <span>Applicant Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-muted-foreground block">Employee Name</span>
              <span className="font-semibold text-foreground">
                {emp ? `${emp.firstName} ${emp.lastName}` : "Unknown Employee"}
              </span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Employee Code</span>
              <span className="font-semibold text-foreground">
                {emp?.employeeCode || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Email Address</span>
              <span className="font-medium text-foreground flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                {emp?.email || "N/A"}
              </span>
            </div>

            <div>
              <span className="text-xs text-muted-foreground block">Designation</span>
              <span className="font-medium text-foreground">
                {emp?.designation || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/60 p-3.5 bg-card">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" /> Start Date
            </span>
            <span className="font-bold text-sm text-foreground">
              {new Date(leave.startDate).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </span>
          </div>

          <div className="rounded-xl border border-border/60 p-3.5 bg-card">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" /> End Date
            </span>
            <span className="font-bold text-sm text-foreground">
              {new Date(leave.endDate).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </span>
          </div>

          <div className="rounded-xl border border-border/60 p-3.5 bg-card">
            <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
              <Clock className="h-3.5 w-3.5 text-indigo-500" /> Duration
            </span>
            <span className="font-bold text-sm text-foreground">
              {duration} {duration === 1 ? "Day" : "Days"}
            </span>
          </div>
        </div>

        {/* Reason Box */}
        <div className="space-y-1.5 rounded-xl border border-border/60 p-4 bg-card">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <FileText className="h-3.5 w-3.5 text-indigo-500" />
            <span>Reason / Justification</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {leave.reason}
          </p>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
          <Button variant="outline" onClick={onClose}>
            Close Window
          </Button>

          {leave.status === "PENDING" && (
            <div className="flex items-center gap-2">
              {onCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onCancel(leave);
                  }}
                  className="text-amber-600 hover:bg-amber-500/10 border-amber-500/30 gap-1.5"
                >
                  <Ban className="h-4 w-4" />
                  Cancel Leave
                </Button>
              )}

              {onReject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onReject(leave);
                  }}
                  className="text-rose-600 hover:bg-rose-500/10 border-rose-500/30 gap-1.5"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              )}

              {onApprove && (
                <Button
                  size="sm"
                  onClick={() => {
                    onClose();
                    onApprove(leave);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Leave
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ViewLeaveModal;
