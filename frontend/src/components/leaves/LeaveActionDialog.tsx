import React from "react";
import { CheckCircle2, XCircle, Ban, Loader2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import {
  useApproveLeave,
  useRejectLeave,
  useCancelLeave,
} from "../../hooks/useLeaves";
import type { LeaveRequest } from "../../types";

export type LeaveActionType = "APPROVE" | "REJECT" | "CANCEL";

interface LeaveActionDialogProps {
  leave: LeaveRequest | null;
  actionType: LeaveActionType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveActionDialog: React.FC<LeaveActionDialogProps> = ({
  leave,
  actionType,
  isOpen,
  onClose,
}) => {
  const approveMutation = useApproveLeave();
  const rejectMutation = useRejectLeave();
  const cancelMutation = useCancelLeave();

  if (!leave || !actionType) return null;

  const emp = leave.employee;
  const fullName = emp ? `${emp.firstName} ${emp.lastName}` : "this employee";

  const isPending =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    cancelMutation.isPending;

  const errorMsg =
    approveMutation.error?.message ||
    rejectMutation.error?.message ||
    cancelMutation.error?.message;

  const handleConfirm = async () => {
    try {
      if (actionType === "APPROVE") {
        await approveMutation.mutateAsync(leave.id);
      } else if (actionType === "REJECT") {
        await rejectMutation.mutateAsync(leave.id);
      } else if (actionType === "CANCEL") {
        await cancelMutation.mutateAsync({
          id: leave.id,
          employeeId: leave.employeeId,
        });
      }
      onClose();
    } catch (err) {
      console.error(`Failed to ${actionType.toLowerCase()} leave:`, err);
    }
  };

  const getDialogConfig = () => {
    switch (actionType) {
      case "APPROVE":
        return {
          title: "Confirm Leave Approval",
          icon: <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0 mt-0.5" />,
          boxClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-700",
          desc: `Are you sure you want to approve the leave request for ${fullName}? Once approved, attendance and payroll systems will reflect this statutory leave.`,
          btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
          btnText: "Confirm Approval",
        };
      case "REJECT":
        return {
          title: "Confirm Leave Rejection",
          icon: <XCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />,
          boxClass: "bg-rose-500/10 border-rose-500/20 text-rose-700",
          desc: `Are you sure you want to reject the leave request for ${fullName}? The applicant will be notified that this request was declined.`,
          btnClass: "bg-rose-600 hover:bg-rose-700 text-white",
          btnText: "Confirm Rejection",
        };
      case "CANCEL":
        return {
          title: "Confirm Leave Cancellation",
          icon: <Ban className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />,
          boxClass: "bg-amber-500/10 border-amber-500/20 text-amber-700",
          desc: `Are you sure you want to cancel the pending leave request for ${fullName}? The application will be withdrawn.`,
          btnClass: "bg-amber-600 hover:bg-amber-700 text-white",
          btnText: "Confirm Cancellation",
        };
    }
  };

  const config = getDialogConfig();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={config.title}
      className="max-w-md"
    >
      <div className="space-y-4 pt-1">
        <div className={`flex items-start gap-3.5 rounded-xl p-4 border ${config.boxClass}`}>
          {config.icon}
          <div className="text-sm">
            <h4 className="font-bold">{config.title}</h4>
            <p className="mt-1 text-xs leading-relaxed opacity-90">{config.desc}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-lg bg-rose-500/10 p-3 text-xs text-rose-600 border border-rose-500/20">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/40">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending}
            className={config.btnClass}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              config.btnText
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LeaveActionDialog;
