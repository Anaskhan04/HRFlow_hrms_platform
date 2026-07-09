import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, UserPlus } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useOrganizations } from "../../hooks/useOrganizations";
import { useDepartments } from "../../hooks/useDepartments";
import { useCreateEmployee } from "../../hooks/useEmployees";

const addEmployeeSchema = z.object({
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

type AddEmployeeFormValues = z.infer<typeof addEmployeeSchema>;

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: organizations = [] } = useOrganizations();
  const { data: departments = [] } = useDepartments();
  const createMutation = useCreateEmployee();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddEmployeeFormValues>({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      employeeCode: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      designation: "",
      organizationId: "",
      departmentId: "",
      joiningDate: new Date().toISOString().split("T")[0],
      salary: "",
      status: "ACTIVE",
    },
  });

  // Auto-select first organization if available and not yet set
  useEffect(() => {
    if (organizations.length > 0) {
      setValue("organizationId", organizations[0].id);
    }
  }, [organizations, setValue]);

  const onSubmit = async (data: AddEmployeeFormValues) => {
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

      if (data.phone && data.phone.trim() !== "") payload.phone = data.phone.trim();
      if (data.departmentId && data.departmentId.trim() !== "") payload.departmentId = data.departmentId;
      if (data.salary && !isNaN(Number(data.salary))) payload.salary = Number(data.salary);

      await createMutation.mutateAsync(payload);
      reset();
      onClose();
    } catch (err) {
      console.error("Failed to create employee:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Add New Employee"
      description="Enter the personal and corporate details to onboard a new team member."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2 text-sm">
        {createMutation.isError && (
          <div className="rounded-md bg-destructive/10 p-3 text-xs font-medium text-destructive border border-destructive/20">
            {createMutation.error?.message || "Failed to add employee. Please check if code or email already exists."}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Employee Code */}
          <div className="space-y-1.5">
            <Label htmlFor="employeeCode">Employee Code *</Label>
            <Input id="employeeCode" placeholder="EMP-1001" {...register("employeeCode")} />
            {errors.employeeCode && (
              <p className="text-xs text-destructive">{errors.employeeCode.message}</p>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <Label htmlFor="designation">Designation *</Label>
            <Input id="designation" placeholder="Software Engineer" {...register("designation")} />
            {errors.designation && (
              <p className="text-xs text-destructive">{errors.designation.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name *</Label>
            <Input id="firstName" placeholder="John" {...register("firstName")} />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input id="lastName" placeholder="Doe" {...register("lastName")} />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" placeholder="john.doe@company.com" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input id="phone" placeholder="+1 (555) 000-0000" {...register("phone")} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Organization */}
          <div className="space-y-1.5">
            <Label htmlFor="organizationId">Organization *</Label>
            <select
              id="organizationId"
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
            <Label htmlFor="departmentId">Department (Optional)</Label>
            <select
              id="departmentId"
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
            <Label htmlFor="joiningDate">Joining Date *</Label>
            <Input id="joiningDate" type="date" {...register("joiningDate")} />
            {errors.joiningDate && (
              <p className="text-xs text-destructive">{errors.joiningDate.message}</p>
            )}
          </div>

          {/* Salary */}
          <div className="space-y-1.5">
            <Label htmlFor="salary">Annual Salary ($)</Label>
            <Input id="salary" type="number" placeholder="85000" {...register("salary")} />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <Label htmlFor="status">Status *</Label>
            <select
              id="status"
              {...register("status")}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onClose();
            }}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending} className="gap-2">
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            <span>{createMutation.isPending ? "Creating..." : "Create Employee"}</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEmployeeModal;
