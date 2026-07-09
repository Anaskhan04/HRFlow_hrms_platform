import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, PlusCircle } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useOrganizations } from "../../hooks/useOrganizations";
import { useCreateDepartment } from "../../hooks/useDepartments";

const addDepartmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().optional(),
  organizationId: z.string().min(1, "Organization is required"),
});

type AddDepartmentFormValues = z.infer<typeof addDepartmentSchema>;

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: organizations = [] } = useOrganizations();
  const createMutation = useCreateDepartment();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddDepartmentFormValues>({
    resolver: zodResolver(addDepartmentSchema),
    defaultValues: {
      name: "",
      description: "",
      organizationId: "",
    },
  });

  useEffect(() => {
    if (organizations.length > 0) {
      setValue("organizationId", organizations[0].id);
    }
  }, [organizations, setValue]);

  const onSubmit = (data: AddDepartmentFormValues) => {
    createMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        organizationId: data.organizationId,
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Department"
      description="Define a new corporate department or functional unit within the organization."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {createMutation.isError && (
          <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/30">
            {createMutation.error?.message || "Failed to create department. Please check your inputs."}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="name">Department Name *</Label>
          <Input
            id="name"
            placeholder="e.g. Research & Development"
            {...register("name")}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
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
          <Label htmlFor="organizationId">Organization *</Label>
          <select
            id="organizationId"
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
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending} className="gap-2">
            {createMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <PlusCircle className="h-4 w-4" />
            <span>Create Department</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDepartmentModal;
