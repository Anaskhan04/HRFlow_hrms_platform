import React from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useDeleteEmployee } from "../../hooks/useEmployees";
import type { Employee } from "../../types";

interface DeleteEmployeeDialogProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteEmployeeDialog: React.FC<DeleteEmployeeDialogProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  const deleteMutation = useDeleteEmployee();

  if (!employee) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(employee.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete employee:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Employee Deletion"
      className="max-w-md border-destructive/30"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-4 rounded-xl bg-destructive/10 p-4 text-destructive border border-destructive/20">
          <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold">Warning: Permanent Deletion</h4>
            <p className="mt-1 text-xs text-destructive/90 leading-relaxed">
              You are about to permanently remove <span className="font-bold">{employee.firstName} {employee.lastName}</span> ({employee.employeeCode}) from the organization. All associated records may be affected. This action cannot be undone.
            </p>
          </div>
        </div>

        {deleteMutation.isError && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive">
            {deleteMutation.error?.message || "Failed to delete employee record."}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="gap-2 font-semibold shadow-sm"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>{deleteMutation.isPending ? "Deleting..." : "Delete Employee"}</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteEmployeeDialog;
