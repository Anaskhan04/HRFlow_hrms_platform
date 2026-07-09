import React from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useDeleteDepartment } from "../../hooks/useDepartments";
import type { Department } from "../../types";

interface DeleteDepartmentDialogProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteDepartmentDialog: React.FC<DeleteDepartmentDialogProps> = ({
  department,
  isOpen,
  onClose,
}) => {
  const deleteMutation = useDeleteDepartment();

  if (!department) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(department.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete department:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Department Deletion"
      className="max-w-md border-destructive/30"
    >
      <div className="space-y-4 pt-1">
        <div className="flex items-start gap-4 rounded-xl bg-destructive/10 p-4 text-destructive border border-destructive/20">
          <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold">Warning: Permanent Deletion</h4>
            <p className="mt-1 text-xs text-destructive/90 leading-relaxed">
              You are about to permanently remove <span className="font-bold">{department.name}</span> from the corporate directory. Ensure no active employees or records depend on this department. This action cannot be undone.
            </p>
          </div>
        </div>

        {deleteMutation.isError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/30">
            {deleteMutation.error?.message || "Failed to delete department. It may have associated employees."}
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
            className="gap-2"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>Delete Department</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDepartmentDialog;
