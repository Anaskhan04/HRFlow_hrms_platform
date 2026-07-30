import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Modal } from "../ui/modal";

import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";
import organizationService from "../../services/organization.service";
import type { PayrollRecord } from "../../types";
import { downloadPayrollPayslip } from "../../utils/payroll-payslip";

interface PayrollDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: PayrollRecord | null;
  onPay: (record: PayrollRecord) => void;
}

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const PayrollDetailsDialog: React.FC<PayrollDetailsDialogProps> = ({
  isOpen,
  onClose,
  record,
  onPay,
}) => {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const shouldFetchOrganizations =
    isOpen &&
    !record?.employee?.organization?.name &&
    !user?.employee?.organization?.name;

  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: organizationService.getOrganizations,
    staleTime: 10 * 60 * 1000,
    enabled: shouldFetchOrganizations,
  });

  useEffect(() => {
    if (!isOpen) {
      setDownloadError(null);
      setIsDownloading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    setDownloadError(null);
  }, [record?.id]);

  if (!record) return null;

  const empName = record.employee
    ? `${record.employee.firstName} ${record.employee.lastName}`
    : "Unknown Employee";
  const empCode = record.employee?.employeeCode || record.employeeId;
  const periodLabel = `${MONTH_NAMES[record.month] || record.month} ${record.year}`;
  const companyName =
    record.employee?.organization?.name ||
    user?.employee?.organization?.name ||
    organizations[0]?.name ||
    "HRFlow Enterprise Corporation";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownloadPayslip = async () => {
    setDownloadError(null);
    setIsDownloading(true);

    try {
      await downloadPayrollPayslip({
        payroll: record,
        companyName,
      });
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "Unable to generate the payslip PDF right now."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Salary Slip Breakdown"
      description={`Monthly earnings statement for ${empName}`}
    >
      <div className="space-y-6 pt-1">
        {/* Header Card */}
        <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-card to-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                {empName}
              </h4>
              <p className="text-xs text-muted-foreground">
                Employee Code: {empCode}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Period
            </div>
            <div className="text-sm font-bold text-foreground">
              {periodLabel}
            </div>
          </div>
        </div>

        {/* Status and Dates */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground">Payment Status</div>
            <div className="mt-1 font-semibold text-sm">
              {record.status === "PAID" ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Paid
                </span>
              ) : record.status === "GENERATED" ? (
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> Generated
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Pending
                </span>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground">Generated Date</div>
            <div className="mt-1 font-semibold text-xs text-foreground">
              {formatDate(record.generatedAt || record.createdAt)}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-3">
            <div className="text-xs text-muted-foreground">Paid Date</div>
            <div className="mt-1 font-semibold text-xs text-foreground">
              {formatDate(record.paidAt)}
            </div>
          </div>
        </div>

        {/* Salary Breakdown Table */}
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="bg-muted/40 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
            Earnings & Deductions Summary
          </div>
          <div className="p-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Basic Salary</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(record.basicSalary)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Allowances & Bonuses</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(record.allowances)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Deductions & Taxes</span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                -{formatCurrency(record.deductions)}
              </span>
            </div>

            <div className="border-t border-border/60 pt-3 flex items-center justify-between">
              <span className="font-bold text-foreground">Net Pay (Take Home)</span>
              <span className="text-lg font-extrabold text-primary">
                {formatCurrency(record.netSalary)}
              </span>
            </div>
          </div>
        </div>

        {downloadError && (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{downloadError}</p>
          </div>
        )}

        {/* Action Footers */}
        <div className="flex flex-col-reverse gap-2 border-t border-border/40 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 w-full sm:w-auto"
          >
            Close
          </Button>

          <Button
            onClick={handleDownloadPayslip}
            disabled={isDownloading}
            className="h-9 w-full gap-2 sm:w-auto"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isDownloading ? "Preparing PDF..." : "Download Payslip"}
          </Button>

          {record.status !== "PAID" && (
            <Button
              onClick={() => {
                onPay(record);
                onClose();
              }}
              className="h-9 w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark as PAID
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
