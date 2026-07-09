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
import { useDepartments } from "../../hooks/useDepartments";
import { useUpdateEmployee } from "../../hooks/useEmployees";
import type { Employee } from "../../types";

const editEmployeeSchema = z.object({
  employeeCode: z.string().min(1, "Employee code is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  designation: z.string().min(1, "Designation is required"),
  organizationId: z.string().min(1, "Organization is required"),
  departmentId: z.string().optional(),
  joiningDate: z.string().min(1, "Joining date is required"),
  salary: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]),
});

type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>;

interface EditEmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  employee,
  isOpen,
  onClose,
}) => {
  const { data: organizations = [] } = useOrganizations();
  const { data: departments = [] } = useDepartments();
  const updateMutation = useUpdateEmployee();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
  });

  // Populate form when employee changes
  useEffect(() => {
    if (employee && isOpen) {
      let formattedDate = "";
      try {
        formattedDate = new Date(employee.joiningDate).toISOString().split("T")[0];
      } catch {
        formattedDate = employee.joiningDate;
      }

      reset({
        employeeCode: employee.employeeCode || "",
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        email: employee.email || "",
        phone: employee.phone || "",
        designation: employee.designation || "",
        organizationId: employee.organizationId || "",
        departmentId: employee.departmentId || "",
        joiningDate: formattedDate,
        salary: employee.salary !== null && employee.salary !== undefined ? String(employee.salary) : "",
        status: employee.status || "ACTIVE",
      });
    }
  }, [employee, isOpen, reset]);

  const onSubmit = async (data: EditEmployeeFormValues) => {
    if (!employee) return;

    try {
      const payload: any = {
        employeeCode: data.employeeCode,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        designation: data.designation,
        organizationId: data.organizationId,
        joiningDate: data.joiningDate,
        status: data.status,
      };

      if (data.phone !== undefined) payload.phone = data.phone.trim() === "" ? null : data.phone.trim();
      if (data.departmentId !== undefined) payload.departmentId = data.departmentId.trim() === "" ? null : data.departmentId;
      if (data.salary !== undefined) payload.salary = data.salary && !isNaN(Number(data.salary)) ? Number(data.salary) : null;

      await updateMutation.mutateAsync({ id: employee.id, data: payload });
      onClose();
    } catch (err) {
      console.error("Failed to update employee:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Employee Record"
      description={`Update personal, departmental, or status details for ${employee?.firstName} ${employee?.lastName}.`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2 text-sm">
        {updateMutation.isError && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            {updateMutation.error?.message || "Failed to update employee. Please check if code or email already exists."}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employee Code */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-employeeCode">Employee Code *</Label>
            <Input id="edit-employeeCode" {...register("employeeCode")} />
            {errors.employeeCode && (
              <p className="text-xs text-destructive">{errors.employeeCode.message}</p>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-designation">Designation *</Label>
            <Input id="edit-designation" {...register("designation")} />
            {errors.designation && (
              <p className="text-xs text-destructive">{errors.designation.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-firstName">First Name *</Label>
            <Input id="edit-firstName" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-lastName">Last Name *</Label>
            <Input id="edit-lastName" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-email">Email Address *</Label>
            <Input id="edit-email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">Phone Number</Label>
            <Input id="edit-phone" {...register("phone")} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Organization */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-organizationId">Organization *</Label>
            <select
              id="edit-organizationId"
              {...register("organizationId")}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
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

          {/* Department */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-departmentId">Department</Label>
            <select
              id="edit-departmentId"
              {...register("departmentId")}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">No Department / Unassigned</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Joining Date */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-joiningDate">Joining Date *</Label>
            <Input id="edit-joiningDate" type="date" {...register("joiningDate")} />
            {errors.joiningDate && (
              <p className="text-xs text-destructive">{errors.joiningDate.message}</p>
            )}
          </div>

          {/* Salary */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-salary">Annual Salary ($)</Label>
            <Input id="edit-salary" type="number" {...register("salary")} />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="edit-status">Status *</Label>
            <select
              id="edit-status"
              {...register("status")}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="TERMINATED">Terminated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
            {updateMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{updateMutation.isPending ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditEmployeeModal;
