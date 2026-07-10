import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  X,
  Calendar,
  LogIn,
  LogOut,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { AttendanceQueryParams } from "../../types";

interface AttendanceSearchFilterProps {
  queryParams: AttendanceQueryParams;
  onFilterChange: (newParams: Partial<AttendanceQueryParams>) => void;
  onReset: () => void;
  onOpenCheckInModal: () => void;
  onOpenCheckOutModal: () => void;
}

export const AttendanceSearchFilter: React.FC<AttendanceSearchFilterProps> = ({
  queryParams,
  onFilterChange,
  onReset,
  onOpenCheckInModal,
  onOpenCheckOutModal,
}) => {
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
    !!queryParams.date;

  return (
    <div className="space-y-4 rounded-xl border bg-card/80 p-4 backdrop-blur-md shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employee by name, code, email, or remarks..."
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={onOpenCheckInModal}
            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20"
          >
            <LogIn className="h-4 w-4" />
            Check In
          </Button>

          <Button
            onClick={onOpenCheckOutModal}
            variant="outline"
            className="gap-2 border-amber-500/50 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
          >
            <LogOut className="h-4 w-4" />
            Check Out
          </Button>
        </div>
      </div>

      {/* Secondary Filter Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span>Filters:</span>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={queryParams.status || "ALL"}
            onChange={(e) =>
              onFilterChange({
                status: e.target.value as any,
                page: 1,
              })
            }
            className="h-9 rounded-lg border bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="LATE">Late</option>
            <option value="HALF_DAY">Half Day</option>
            <option value="ABSENT">Absent</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="date"
              value={queryParams.date || ""}
              onChange={(e) =>
                onFilterChange({
                  date: e.target.value || undefined,
                  page: 1,
                })
              }
              className="h-9 rounded-lg border bg-background pl-8 pr-3 py-1 text-sm text-foreground shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {queryParams.date && (
            <button
              type="button"
              onClick={() => onFilterChange({ date: undefined, page: 1 })}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Clear Date
            </button>
          )}
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            <X className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};
