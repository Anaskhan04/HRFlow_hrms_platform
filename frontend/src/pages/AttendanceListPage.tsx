import React, { useState } from "react";
import { RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { useAttendanceList } from "../hooks/useAttendance";
import {
  AttendanceSearchFilter,
  AttendanceTable,
  AttendancePagination,
  CheckInModal,
  CheckOutModal,
} from "../components/attendance";
import { Button } from "../components/ui/button";
import type { AttendanceRecord, AttendanceQueryParams } from "../types";

export const AttendanceListPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<AttendanceQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    status: "ALL",
  });

  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [checkOutModalState, setCheckOutModalState] = useState<{
    isOpen: boolean;
    record: AttendanceRecord | null;
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
  } = useAttendanceList(queryParams);

  const attendance = data?.attendance || [];
  const pagination = data?.pagination || {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    total: 0,
    totalPages: 1,
  };

  const handleFilterChange = (newParams: Partial<AttendanceQueryParams>) => {
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
      date: undefined,
    });
  };

  const handlePageChange = (newPage: number) => {
    handleFilterChange({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    handleFilterChange({ limit: newLimit, page: 1 });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Attendance Management
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3 w-3" />
              Live Logs
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor daily employee check-ins, check-outs, and working hours across departments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {isError && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Failed to fetch attendance logs</p>
            <p className="text-xs opacity-90">
              {error?.message || "An unexpected network error occurred."}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-red-500/30 text-red-600 hover:bg-red-500/20"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Search & Filters */}
      <AttendanceSearchFilter
        queryParams={queryParams}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenCheckInModal={() => setIsCheckInModalOpen(true)}
        onOpenCheckOutModal={() =>
          setCheckOutModalState({ isOpen: true, record: null })
        }
      />

      {/* Attendance Table */}
      <AttendanceTable
        attendance={attendance}
        isLoading={isLoading}
        onCheckOutRecord={(record) =>
          setCheckOutModalState({ isOpen: true, record })
        }
      />

      {/* Pagination */}
      {pagination.total > 0 && (
        <AttendancePagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}

      {/* Check In Modal */}
      <CheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />

      {/* Check Out Modal */}
      <CheckOutModal
        isOpen={checkOutModalState.isOpen}
        onClose={() =>
          setCheckOutModalState({ isOpen: false, record: null })
        }
        record={checkOutModalState.record}
      />
    </div>
  );
};
