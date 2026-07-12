import React from "react";
import {
  DollarSign,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { PayrollRecord, PayrollStatus } from "../../types";
import { Button } from "../ui/button";

interface PayrollTableProps {
  payrolls: PayrollRecord[];
  isLoading: boolean;
  onViewDetails: (record: PayrollRecord) => void;
  onEdit: (record: PayrollRecord) => void;
  onDelete: (record: PayrollRecord) => void;
  onPay: (record: PayrollRecord) => void;
}

const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const PayrollTable: React.FC<PayrollTableProps> = ({
  payrolls,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
  onPay,
}) => {
  const getStatusBadge = (status: PayrollStatus) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </span>
        );
      case "GENERATED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <FileText className="h-3 w-3" />
            Generated
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border/40 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-64 rounded bg-muted" />
                </div>
              </div>
              <div className="h-8 w-28 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (payrolls.length === 0) {
    return (
      <div className="rounded-xl border bg-card/50 p-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 mb-4 text-emerald-500">
          <DollarSign className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Payroll Records Found</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          No payroll entries matched your current search and filter criteria. Try resetting filters or generate a new monthly payroll.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3.5">Employee</th>
              <th className="px-6 py-3.5">Period</th>
              <th className="px-6 py-3.5">Basic Salary</th>
              <th className="px-6 py-3.5">Additions / Deductions</th>
              <th className="px-6 py-3.5">Net Salary</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {payrolls.map((record) => {
              const empName = record.employee
                ? `${record.employee.firstName} ${record.employee.lastName}`
                : "Unknown Employee";
              const empCode = record.employee?.employeeCode || record.employeeId;
              const periodLabel = `${MONTH_NAMES[record.month] || record.month} ${record.year}`;

              return (
                <tr
                  key={record.id}
                  className="group hover:bg-muted/30 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {empName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {empName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {empCode}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">
                      {periodLabel}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-medium text-foreground">
                    {formatCurrency(record.basicSalary)}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs space-y-0.5">
                      <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                        <TrendingUp className="mr-1 h-3 w-3" />+
                        {formatCurrency(record.allowances)}
                      </span>
                      <span className="flex items-center text-red-600 dark:text-red-400 font-medium">
                        <TrendingDown className="mr-1 h-3 w-3" />-
                        {formatCurrency(record.deductions)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-bold text-foreground text-base">
                      {formatCurrency(record.netSalary)}
                    </span>
                  </td>

                  <td className="px-6 py-4">{getStatusBadge(record.status)}</td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {record.status !== "PAID" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPay(record)}
                          className="h-8 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 text-xs font-semibold px-2.5"
                        >
                          Mark Paid
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(record)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="View Salary Slip Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(record)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Edit Payroll"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(record)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500"
                        title="Delete Payroll"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
