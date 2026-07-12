import React, { useState, useEffect } from "react";
import { AlertCircle, Calculator } from "lucide-react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useUpdatePayroll } from "../../hooks/usePayrolls";
import type { PayrollRecord, PayrollStatus } from "../../types";

interface EditPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
}

const MONTHS = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export const EditPayrollModal: React.FC<EditPayrollModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  const updateMutation = useUpdatePayroll();

  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(2026);
  const [basicSalary, setBasicSalary] = useState<string>("");
  const [allowances, setAllowances] = useState<string>("0");
  const [deductions, setDeductions] = useState<string>("0");
  const [status, setStatus] = useState<PayrollStatus>("GENERATED");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setMonth(record.month);
      setYear(record.year);
      setBasicSalary(record.basicSalary.toString());
      setAllowances(record.allowances.toString());
      setDeductions(record.deductions.toString());
      setStatus(record.status);
      setErrorMsg(null);
    }
  }, [record]);

  const numericBasic = parseFloat(basicSalary) || 0;
  const numericAllowances = parseFloat(allowances) || 0;
  const numericDeductions = parseFloat(deductions) || 0;
  const calculatedNet = Math.max(
    0,
    numericBasic + numericAllowances - numericDeductions
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!record) return;

    if (numericBasic < 0) {
      setErrorMsg("Basic salary cannot be negative.");
      return;
    }

    setErrorMsg(null);
    try {
      await updateMutation.mutateAsync({
        id: record.id,
        data: {
          month,
          year,
          basicSalary: numericBasic,
          allowances: numericAllowances,
          deductions: numericDeductions,
          status,
        },
      });
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update payroll record.";
      setErrorMsg(message);
    }
  };

  const empName = record?.employee
    ? `${record.employee.firstName} ${record.employee.lastName}`
    : "Employee";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Payroll - ${empName}`}
      description="Modify salary components, period, or payment status."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Month & Year */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Month <span className="text-red-500">*</span>
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Year <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              min="2020"
              max="2030"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              required
            />
          </div>
        </div>

        {/* Basic Salary & Status */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Basic Salary ($) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as PayrollStatus)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="PENDING">Pending</option>
              <option value="GENERATED">Generated</option>
              <option value="PAID">Paid</option>
            </select>
          </div>
        </div>

        {/* Allowances & Deductions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Allowances ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Deductions ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
            />
          </div>
        </div>

        {/* Live Net Salary Preview */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Calculator className="h-4 w-4 text-primary" />
            Recalculated Net Salary:
          </div>
          <div className="text-base font-bold text-primary">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(calculatedNet)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="gap-2"
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
