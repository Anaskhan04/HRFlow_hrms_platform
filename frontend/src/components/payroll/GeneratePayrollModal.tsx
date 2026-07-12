import React, { useState, useEffect } from "react";
import { AlertCircle, Calculator } from "lucide-react";
import { Modal } from "../ui/modal";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useGeneratePayroll } from "../../hooks/usePayrolls";
import { useEmployees } from "../../hooks/useEmployees";

interface GeneratePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export const GeneratePayrollModal: React.FC<GeneratePayrollModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: employeesData } = useEmployees({ limit: 100 });
  const employees = employeesData?.employees || [];
  const generateMutation = useGeneratePayroll();

  const now = new Date();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [basicSalary, setBasicSalary] = useState<string>("");
  const [allowances, setAllowances] = useState<string>("0");
  const [deductions, setDeductions] = useState<string>("0");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto-populate basic salary when employee changes
  useEffect(() => {
    if (selectedEmployeeId) {
      const emp = employees.find((e) => e.id === selectedEmployeeId);
      if (emp && emp.salary) {
        setBasicSalary(emp.salary.toString());
      }
    }
  }, [selectedEmployeeId, employees]);

  const numericBasic = parseFloat(basicSalary) || 0;
  const numericAllowances = parseFloat(allowances) || 0;
  const numericDeductions = parseFloat(deductions) || 0;
  const calculatedNet = Math.max(
    0,
    numericBasic + numericAllowances - numericDeductions
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeId) {
      setErrorMsg("Please select an employee.");
      return;
    }

    if (numericBasic < 0) {
      setErrorMsg("Basic salary cannot be negative.");
      return;
    }

    setErrorMsg(null);
    try {
      await generateMutation.mutateAsync({
        employeeId: selectedEmployeeId,
        month,
        year,
        basicSalary: numericBasic,
        allowances: numericAllowances,
        deductions: numericDeductions,
      });
      setSelectedEmployeeId("");
      setBasicSalary("");
      setAllowances("0");
      setDeductions("0");
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate monthly payroll.";
      setErrorMsg(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Monthly Payroll"
      description="Create a salary record and calculate net compensation for an employee."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Select Employee */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Employee <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            required
          >
            <option value="">Select Employee...</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} ({emp.employeeCode})
              </option>
            ))}
          </select>
        </div>

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

        {/* Basic Salary */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Basic Salary ($) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 5000.00"
            value={basicSalary}
            onChange={(e) => setBasicSalary(e.target.value)}
            required
          />
        </div>

        {/* Allowances & Deductions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Allowances / Bonuses ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Deductions / Taxes ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={deductions}
              onChange={(e) => setDeductions(e.target.value)}
            />
          </div>
        </div>

        {/* Live Net Salary Preview */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Calculator className="h-4 w-4 text-primary" />
            Estimated Net Salary:
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
            disabled={generateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={generateMutation.isPending}
            className="gap-2"
          >
            {generateMutation.isPending ? "Generating..." : "Generate Payroll"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
