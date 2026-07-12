import React from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useDeletePayroll } from "../../hooks/usePayrolls";
import type { PayrollRecord } from "../../types";

interface DeletePayrollDialogProps {
  record: PayrollRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DeletePayrollDialog: React.FC<DeletePayrollDialogProps> = ({
  record,
  isOpen,
  onClose,
}) => {
  const deleteMutation = useDeletePayroll();

  if (!record) return null;

  const empName = record.employee
    ? `${record.employee.firstName} ${record.employee.lastName}`
    : "this employee";
  const periodLabel = `${MONTH_NAMES[record.month] || record.month} ${record.year}`;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(record.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete payroll record:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Payroll Record"
      description="Permanent removal confirmation"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-red-600 dark:text-red-400">
              Are you sure you want to delete this payroll record?
            </p>
            <p className="text-muted-foreground">
              You are about to permanently remove the salary record for{" "}
              <strong className="text-foreground">{empName}</strong> for the
              period <strong className="text-foreground">{periodLabel}</strong>.
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Payroll
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
