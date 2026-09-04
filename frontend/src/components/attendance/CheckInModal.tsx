import React, { useState } from "react";
import { LogIn, Clock, AlertCircle } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useCheckIn } from "../../hooks/useAttendance";
import { useEmployees } from "../../hooks/useEmployees";
import { useAuth } from "../../hooks/useAuth";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const userEmployeeId = user?.employeeId || user?.employee?.id || "";

  const { data: employeesData } = useEmployees({ limit: 100 }, { enabled: isAdmin });
  const employees = employeesData?.employees || [];
  const checkInMutation = useCheckIn();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedEmployeeId(isAdmin ? "" : userEmployeeId);
      setRemarks("");
      setErrorMsg(null);
    }
  }, [isOpen, isAdmin, userEmployeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmployeeId = isAdmin ? (selectedEmployeeId || userEmployeeId) : userEmployeeId;

    if (!targetEmployeeId) {
      setErrorMsg(isAdmin ? "Please select an employee to check in." : "No linked employee record found for your account.");
      return;
    }

    setErrorMsg(null);
    try {
      await checkInMutation.mutateAsync({
        employeeId: targetEmployeeId,
        remarks: remarks.trim() ? remarks.trim() : undefined,
      });
      setSelectedEmployeeId(isAdmin ? "" : userEmployeeId);
      setRemarks("");
      onClose();
    } catch (err) {
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.message ||
        "Failed to check in employee.";
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
      title="Record Check In"
      description="Record current attendance check-in time for an employee."
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
          <span className="text-muted-foreground font-medium">Check-In Time</span>
          <div className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
            <Clock className="h-3.5 w-3.5" />
            <span>Now ({nowStr})</span>
          </div>
        </div>

        {/* Select Employee (Visible ONLY for ADMIN) */}
        {isAdmin && (
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
              className="w-full h-10 rounded-lg border bg-background px-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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
        )}

        {/* Remarks */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Remarks (Optional)
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Working from office / remote shift start..."
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
            disabled={checkInMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={checkInMutation.isPending}
            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            <LogIn className="h-4 w-4" />
            {checkInMutation.isPending ? "Checking In..." : "Confirm Check In"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
