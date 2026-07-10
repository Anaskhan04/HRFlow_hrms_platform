import React, { useState, useEffect } from "react";
import { LogOut, Clock, AlertCircle } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useCheckOut } from "../../hooks/useAttendance";
import { useEmployees } from "../../hooks/useEmployees";
import type { AttendanceRecord } from "../../types";

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: AttendanceRecord | null;
}

export const CheckOutModal: React.FC<CheckOutModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const { data: employeesData } = useEmployees({ limit: 100 });
  const employees = employeesData?.employees || [];
  const checkOutMutation = useCheckOut();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    record?.employeeId || ""
  );
  const [remarks, setRemarks] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (record?.employeeId) {
      setSelectedEmployeeId(record.employeeId);
    }
  }, [record]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setErrorMsg("Please select an employee to check out.");
      return;
    }

    setErrorMsg(null);
    try {
      await checkOutMutation.mutateAsync({
        employeeId: selectedEmployeeId,
        remarks: remarks.trim() ? remarks.trim() : undefined,
      });
      setSelectedEmployeeId("");
      setRemarks("");
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to check out employee.";
      setErrorMsg(message);
    }
  };

  const nowStr = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Check Out"
      description="Record current attendance check-out time and finalize working hours."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400 border border-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Current Time Preview */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 text-xs border">
          <span className="text-muted-foreground font-medium">Check-Out Time</span>
          <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Now ({nowStr})</span>
          </div>
        </div>

        {/* Select Employee */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Employee <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => {
              setSelectedEmployeeId(e.target.value);
              setErrorMsg(null);
            }}
            disabled={!!record}
            className="w-full h-10 rounded-lg border bg-background px-3 text-sm text-foreground shadow-sm disabled:bg-muted disabled:opacity-75 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            required
          >
            <option value="">Select an employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.employeeCode})
              </option>
            ))}
          </select>
        </div>

        {/* Remarks */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Check-Out Remarks (Optional)
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. End of shift / finished daily tasks..."
            rows={2}
            className="w-full rounded-lg border bg-background p-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={checkOutMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={checkOutMutation.isPending}
            className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
          >
            <LogOut className="h-4 w-4" />
            {checkOutMutation.isPending ? "Checking Out..." : "Confirm Check Out"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
