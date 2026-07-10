import React, { useState } from "react";
import { RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { useLeaves } from "../hooks/useLeaves";
import {
  LeaveSearchFilter,
  LeaveTable,
  LeavePagination,
  ApplyLeaveModal,
  ViewLeaveModal,
  LeaveActionDialog,
  type LeaveActionType,
} from "../components/leaves";
import { Button } from "../components/ui/button";
import type { LeaveRequest, LeaveQueryParams } from "../types";

export const LeaveListPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<LeaveQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "ALL",
    leaveTypeId: "ALL",
    sort: "createdAt",
    order: "desc",
  });

  // Modal control states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [viewingLeave, setViewingLeave] = useState<LeaveRequest | null>(null);
  const [actionModalState, setActionModalState] = useState<{
    leave: LeaveRequest | null;
    actionType: LeaveActionType | null;
  }>({
    leave: null,
    actionType: null,
  });

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useLeaves(queryParams);

  const leaves = data?.leaves || [];
  const pagination = data?.pagination || {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    total: 0,
    totalPages: 1,
  };

  const handleFilterChange = (newParams: Partial<LeaveQueryParams>) => {
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
      status: "ALL",
      leaveTypeId: "ALL",
      sort: "createdAt",
      order: "desc",
    });
  };

  const openActionDialog = (leave: LeaveRequest, actionType: LeaveActionType) => {
    setActionModalState({
      leave,
      actionType,
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent p-6 backdrop-blur-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-500/20">
              <Sparkles className="h-3.5 w-3.5" /> Leave & Time-Off Suite
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Leave Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review employee time-off applications, approve statutory requests, and maintain audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-2 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {isError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">Failed to load leave requests</h4>
              <p className="text-xs opacity-90 mt-0.5">
                {error?.message || "An unexpected error occurred while communicating with the backend API."}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Filters & Actions Bar */}
      <LeaveSearchFilter
        queryParams={queryParams}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenApplyModal={() => setIsApplyModalOpen(true)}
      />

      {/* Main Table */}
      <LeaveTable
        leaves={leaves}
        isLoading={isLoading}
        onView={(leave) => setViewingLeave(leave)}
        onApprove={(leave) => openActionDialog(leave, "APPROVE")}
        onReject={(leave) => openActionDialog(leave, "REJECT")}
        onCancel={(leave) => openActionDialog(leave, "CANCEL")}
      />

      {/* Pagination */}
      {pagination.total > 0 && (
        <LeavePagination
          pagination={pagination}
          onPageChange={(newPage) => handleFilterChange({ page: newPage })}
          onLimitChange={(newLimit) => handleFilterChange({ limit: newLimit, page: 1 })}
        />
      )}

      {/* Modals */}
      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />

      <ViewLeaveModal
        isOpen={!!viewingLeave}
        onClose={() => setViewingLeave(null)}
        leave={viewingLeave}
        onApprove={(leave) => openActionDialog(leave, "APPROVE")}
        onReject={(leave) => openActionDialog(leave, "REJECT")}
        onCancel={(leave) => openActionDialog(leave, "CANCEL")}
      />

      <LeaveActionDialog
        isOpen={!!actionModalState.actionType}
        onClose={() => setActionModalState({ leave: null, actionType: null })}
        leave={actionModalState.leave}
        actionType={actionModalState.actionType}
      />
    </div>
  );
};

export default LeaveListPage;
