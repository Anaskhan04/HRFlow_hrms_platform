import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useEmployees } from "../../hooks/useEmployees";
import { useLeaveTypes, useApplyLeave } from "../../hooks/useLeaves";
import { Calendar, User, FileText, AlertCircle } from "lucide-react";

const applyLeaveSchema = z
  .object({
    employeeId: z.string().min(1, "Please select an employee"),
    leaveTypeId: z.string().min(1, "Please select a leave type"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z
      .string()
      .min(5, "Reason must be at least 5 characters")
      .max(500, "Reason must not exceed 500 characters"),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date cannot be earlier than start date",
      path: ["endDate"],
    }
  );

type ApplyLeaveFormValues = z.infer<typeof applyLeaveSchema>;

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: employeesData } = useEmployees({ limit: 100 });
  const { data: leaveTypes = [] } = useLeaveTypes();
  const applyMutation = useApplyLeave();

  const employees = useMemo(() => employeesData?.employees || [], [employeesData?.employees]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyLeaveFormValues>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      employeeId: "",
      leaveTypeId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      reason: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        employeeId: employees[0]?.id || "",
        leaveTypeId: leaveTypes[0]?.id || "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        reason: "",
      });
    }
  }, [isOpen, reset, employees, leaveTypes]);

  const onSubmit = (data: ApplyLeaveFormValues) => {
    applyMutation.mutate(
      {
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
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
      title="Apply for Employee Leave"
      description="Submit a new statutory leave application for review and approval."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {applyMutation.isError && (
          <div className="flex items-center gap-2 rounded-lg border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {applyMutation.error?.message ||
                "Failed to submit leave application. Please verify details."}
            </span>
          </div>
        )}

        {/* Employee Selector */}
        <div className="space-y-1.5">
          <Label htmlFor="employeeId" className="flex items-center gap-1.5 text-xs font-semibold">
            <User className="h-3.5 w-3.5 text-indigo-500" />
            Employee <span className="text-rose-500">*</span>
          </Label>
          <select
            id="employeeId"
            {...register("employeeId")}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select an employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.employeeCode}) – {emp.designation}
              </option>
            ))}
          </select>
          {errors.employeeId && (
            <p className="text-xs text-rose-500">{errors.employeeId.message}</p>
          )}
        </div>

        {/* Leave Type Selector */}
        <div className="space-y-1.5">
          <Label htmlFor="leaveTypeId" className="flex items-center gap-1.5 text-xs font-semibold">
            <Calendar className="h-3.5 w-3.5 text-indigo-500" />
            Leave Type <span className="text-rose-500">*</span>
          </Label>
          <select
            id="leaveTypeId"
            {...register("leaveTypeId")}
            className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select leave type...</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.leaveTypeId && (
            <p className="text-xs text-rose-500">{errors.leaveTypeId.message}</p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="startDate" className="text-xs font-semibold">
              Start Date <span className="text-rose-500">*</span>
            </Label>
            <Input id="startDate" type="date" {...register("startDate")} />
            {errors.startDate && (
              <p className="text-xs text-rose-500">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="endDate" className="text-xs font-semibold">
              End Date <span className="text-rose-500">*</span>
            </Label>
            <Input id="endDate" type="date" {...register("endDate")} />
            {errors.endDate && (
              <p className="text-xs text-rose-500">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {/* Reason */}
        <div className="space-y-1.5">
          <Label htmlFor="reason" className="flex items-center gap-1.5 text-xs font-semibold">
            <FileText className="h-3.5 w-3.5 text-indigo-500" />
            Reason / Notes <span className="text-rose-500">*</span>
          </Label>
          <textarea
            id="reason"
            rows={3}
            {...register("reason")}
            placeholder="Provide brief justification or medical/travel notes..."
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.reason && (
            <p className="text-xs text-rose-500">{errors.reason.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={applyMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={applyMutation.isPending}
          >
            {applyMutation.isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLeaveModal;
