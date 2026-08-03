import React, { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "../ui/modal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useEmployees } from "../../hooks/useEmployees";
import { useLeaveTypes, useApplyLeave, useLeaveBalances } from "../../hooks/useLeaves";
import { Calendar, User, FileText, AlertCircle, Wallet } from "lucide-react";

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

/** Calculate number of calendar days (inclusive) between two date strings. */
function calcLeaveDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return 0;
  const diffMs = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

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
    control,
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

  // Watch relevant fields for live balance calculation
  const watchedEmployeeId = useWatch({ control, name: "employeeId" });
  const watchedLeaveTypeId = useWatch({ control, name: "leaveTypeId" });
  const watchedStartDate = useWatch({ control, name: "startDate" });
  const watchedEndDate = useWatch({ control, name: "endDate" });

  // Fetch leave balances for the selected employee
  const { data: balances = [] } = useLeaveBalances(watchedEmployeeId);

  // Find balance for the selected leave type
  const selectedBalance = useMemo(
    () => balances.find((b: { leaveTypeId: string }) => b.leaveTypeId === watchedLeaveTypeId) ?? null,
    [balances, watchedLeaveTypeId]
  );

  // Calculate requested days live
  const requestedDays = useMemo(
    () => calcLeaveDays(watchedStartDate, watchedEndDate),
    [watchedStartDate, watchedEndDate]
  );

  const hasInsufficientBalance =
    selectedBalance !== null &&
    watchedLeaveTypeId &&
    requestedDays > 0 &&
    requestedDays > selectedBalance.balance;

  const balanceUnknown =
    watchedEmployeeId && watchedLeaveTypeId && selectedBalance === null;

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

        {/* Leave Type Selector + Balance badge */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="leaveTypeId" className="flex items-center gap-1.5 text-xs font-semibold">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              Leave Type <span className="text-rose-500">*</span>
            </Label>
            {watchedEmployeeId && watchedLeaveTypeId && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                  selectedBalance === null
                    ? "bg-slate-100 text-slate-500 border-slate-200"
                    : selectedBalance.balance <= 0
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : selectedBalance.balance <= 3
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                <Wallet className="h-3 w-3" />
                {selectedBalance === null
                  ? "Balance: N/A"
                  : `${selectedBalance.balance} day${selectedBalance.balance !== 1 ? "s" : ""} available`}
              </span>
            )}
          </div>
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

        {/* Live day count + balance check */}
        {requestedDays > 0 && watchedLeaveTypeId && watchedEmployeeId && (
          <div
            className={`rounded-lg border p-3 text-xs flex items-center gap-2 ${
              hasInsufficientBalance
                ? "bg-rose-50 border-rose-300 text-rose-700"
                : balanceUnknown
                ? "bg-amber-50 border-amber-300 text-amber-700"
                : "bg-indigo-50 border-indigo-200 text-indigo-700"
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              {hasInsufficientBalance
                ? `⚠️ Insufficient balance — requesting ${requestedDays} day${requestedDays !== 1 ? "s" : ""} but only ${selectedBalance?.balance ?? 0} available.`
                : balanceUnknown
                ? "No leave balance record found for this type. HR must allocate balance first."
                : `Requesting ${requestedDays} day${requestedDays !== 1 ? "s" : ""} · ${selectedBalance?.balance} day${selectedBalance?.balance !== 1 ? "s" : ""} remaining after approval.`}
            </span>
          </div>
        )}

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
            disabled={applyMutation.isPending || !!hasInsufficientBalance || !!balanceUnknown}
          >
            {applyMutation.isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ApplyLeaveModal;
