import React, { useState, useEffect } from "react";
import { Search, Filter, X, ArrowUpDown, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useLeaveTypes } from "../../hooks/useLeaves";
import type { LeaveQueryParams } from "../../types";

interface LeaveSearchFilterProps {
  queryParams: LeaveQueryParams;
  onFilterChange: (newParams: Partial<LeaveQueryParams>) => void;
  onReset: () => void;
  onOpenApplyModal: () => void;
}

export const LeaveSearchFilter: React.FC<LeaveSearchFilterProps> = ({
  queryParams,
  onFilterChange,
  onReset,
  onOpenApplyModal,
}) => {
  const { data: leaveTypes = [] } = useLeaveTypes();
  const [searchInput, setSearchInput] = useState(queryParams.search || "");

  useEffect(() => {
    setSearchInput(queryParams.search || "");
  }, [queryParams.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== (queryParams.search || "")) {
        onFilterChange({ search: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput, queryParams.search, onFilterChange]);

  const hasActiveFilters =
    !!queryParams.search ||
    (queryParams.status && queryParams.status !== "ALL") ||
    (queryParams.leaveTypeId && queryParams.leaveTypeId !== "ALL") ||
    (queryParams.sort && queryParams.sort !== "createdAt");

  return (
    <div className="space-y-4 rounded-xl border bg-card/80 p-4 backdrop-blur-md shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by employee name, code, email, or reason..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 bg-background/80"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Apply Leave Button */}
        <div className="flex items-center gap-2">
          <Button
            onClick={onOpenApplyModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Apply Leave
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={queryParams.status || "ALL"}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Leave Type Filter */}
          <select
            value={queryParams.leaveTypeId || "ALL"}
            onChange={(e) => onFilterChange({ leaveTypeId: e.target.value, page: 1 })}
            className="h-9 rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Leave Types</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Reset Filters
            </Button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Sort by:</span>
          <select
            value={queryParams.sort || "createdAt"}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
            className="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-sm focus:outline-none"
          >
            <option value="createdAt">Application Date</option>
            <option value="startDate">Start Date</option>
            <option value="status">Status</option>
          </select>
          <button
            type="button"
            onClick={() =>
              onFilterChange({
                order: queryParams.order === "asc" ? "desc" : "asc",
              })
            }
            className="flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
            title={`Order: ${queryParams.order === "asc" ? "Ascending" : "Descending"}`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveSearchFilter;
