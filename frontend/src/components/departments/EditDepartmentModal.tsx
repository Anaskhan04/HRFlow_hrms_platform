import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useOrganizations } from "../../hooks/useOrganizations";
import { useUpdateDepartment } from "../../hooks/useDepartments";
import type { Department } from "../../types";

const editDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().optional(),
  organizationId: z.string().min(1, "Organization is required"),
});

type EditDepartmentFormValues = z.infer<typeof editDepartmentSchema>;

interface EditDepartmentModalProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditDepartmentModal: React.FC<EditDepartmentModalProps> = ({
  department,
  isOpen,
  onClose,
}) => {
  const { data: organizations = [] } = useOrganizations();
  const updateMutation = useUpdateDepartment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditDepartmentFormValues>({
    resolver: zodResolver(editDepartmentSchema),
  });

  useEffect(() => {
    if (department && isOpen) {
      reset({
        name: department.name || "",
        description: department.description || "",
        organizationId: department.organizationId || "",
      });
    }
  }, [department, isOpen, reset]);

  const onSubmit = (data: EditDepartmentFormValues) => {
    if (!department) return;

    updateMutation.mutate(
      {
        id: department.id,
        data: {
          name: data.name,
          description: data.description || undefined,
          organizationId: data.organizationId,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Department Details"
      description="Modify functional hierarchy details or update corporate unit description."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {updateMutation.isError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/30">
            {updateMutation.error?.message || "Failed to update department details."}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="edit-name">Department Name *</Label>
          <Input
            id="edit-name"
            placeholder="e.g. Research & Development"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-description">Description</Label>
          <textarea
            id="edit-description"
            rows={3}
            placeholder="Brief overview of department functions and goals..."
            {...register("description")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-organizationId">Organization *</Label>
          <select
            id="edit-organizationId"
            {...register("organizationId")}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          {errors.organizationId && (
            <p className="text-xs text-destructive">{errors.organizationId.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditDepartmentModal;
