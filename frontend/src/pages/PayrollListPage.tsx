import React, { useState } from "react";
import {
  RefreshCw,
  AlertCircle,
  DollarSign,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { usePayrollList, usePayPayroll } from "../hooks/usePayrolls";

import {
  PayrollSearchFilter,
  PayrollTable,
  PayrollPagination,
  GeneratePayrollModal,
  EditPayrollModal,
  PayrollDetailsDialog,
  DeletePayrollDialog,
} from "../components/payroll";
import { Button } from "../components/ui/button";
import type { PayrollRecord, PayrollQueryParams } from "../types";

export const PayrollListPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<PayrollQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    month: "ALL",
    year: "ALL",
    status: "ALL",
    sort: "createdAt",
    order: "desc",
  });

  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    record: PayrollRecord | null;
  }>({
    isOpen: false,
    record: null,
  });

  const [detailsDialogState, setDetailsDialogState] = useState<{
    isOpen: boolean;
    record: PayrollRecord | null;
  }>({
    isOpen: false,
    record: null,
  });

  const [deleteDialogState, setDeleteDialogState] = useState<{
    isOpen: boolean;
    record: PayrollRecord | null;
  }>({
    isOpen: false,
    record: null,
  });

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = usePayrollList(queryParams);

  const payMutation = usePayPayroll();

  const payrolls = data?.payrolls || [];
  const pagination = data?.pagination || {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    total: 0,
    totalPages: 1,
  };

  // Compute live statistics for current list view
  const totalRecords = pagination.total;
  const totalPaidSum = payrolls
    .filter((r) => r.status === "PAID")
    .reduce((acc, r) => acc + (r.netSalary || 0), 0);
  const totalPendingSum = payrolls
    .filter((r) => r.status !== "PAID")
    .reduce((acc, r) => acc + (r.netSalary || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const handleFilterChange = (newParams: Partial<PayrollQueryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newParams,
    }));
  };

  const handleResetFilters = () => {
    setQueryParams({
      page: 1,
      limit: 10,
      search: "",
      month: "ALL",
      year: "ALL",
      status: "ALL",
      sort: "createdAt",
      order: "desc",
    });
  };

  const handleMarkAsPaid = async (record: PayrollRecord) => {
    try {
      await payMutation.mutateAsync(record.id);
    } catch (err) {
      console.error("Failed to mark payroll as paid:", err);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Payroll Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage monthly salary computations, additions, deductions, and payment statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5 shadow-sm"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase">
              Total Records
            </div>
            <div className="mt-1 text-2xl font-bold text-foreground">
              {totalRecords}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase">
              Disbursed (Paid)
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalPaidSum)}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase">
              Pending Disbursal
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(totalPendingSum)}
            </div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold">Failed to fetch payroll list</p>
            <p className="text-xs opacity-90">
              {(error as any)?.message ||
                "Please verify your connection or refresh the page."}
            </p>
          </div>
        </div>
      )}

      {/* Search & Filter Section */}
      <PayrollSearchFilter
        queryParams={queryParams}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenGenerateModal={() => setIsGenerateModalOpen(true)}
      />

      {/* Payroll Table */}
      <PayrollTable
        payrolls={payrolls}
        isLoading={isLoading}
        onViewDetails={(record) =>
          setDetailsDialogState({ isOpen: true, record })
        }
        onEdit={(record) => setEditModalState({ isOpen: true, record })}
        onDelete={(record) =>
          setDeleteDialogState({ isOpen: true, record })
        }
        onPay={handleMarkAsPaid}
      />

      {/* Pagination */}
      {!isLoading && pagination.total > 0 && (
        <PayrollPagination
          pagination={pagination}
          onPageChange={(newPage) => handleFilterChange({ page: newPage })}
          onLimitChange={(newLimit) =>
            handleFilterChange({ limit: newLimit, page: 1 })
          }
        />
      )}

      {/* Modals & Dialogs */}
      <GeneratePayrollModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
      />

      <EditPayrollModal
        isOpen={editModalState.isOpen}
        onClose={() => setEditModalState({ isOpen: false, record: null })}
        record={editModalState.record}
      />

      <PayrollDetailsDialog
        isOpen={detailsDialogState.isOpen}
        onClose={() =>
          setDetailsDialogState({ isOpen: false, record: null })
        }
        record={detailsDialogState.record}
        onPay={handleMarkAsPaid}
      />

      <DeletePayrollDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() =>
          setDeleteDialogState({ isOpen: false, record: null })
        }
        record={deleteDialogState.record}
      />
    </div>
  );
};
