import React, { useState, useEffect } from "react";
import { Search, Filter, X, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";

import { Button } from "../ui/button";
import type { PayrollQueryParams, PayrollStatus } from "../../types";

interface PayrollSearchFilterProps {
  queryParams: PayrollQueryParams;
  onFilterChange: (newParams: Partial<PayrollQueryParams>) => void;
  onReset: () => void;
  onOpenGenerateModal: () => void;
}

const MONTH_NAMES = [
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

export const PayrollSearchFilter: React.FC<PayrollSearchFilterProps> = ({
  queryParams,
  onFilterChange,
  onReset,
  onOpenGenerateModal,
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
    (queryParams.month !== undefined && queryParams.month !== "ALL") ||
    (queryParams.year !== undefined && queryParams.year !== "ALL");

  return (
    <div className="space-y-4 rounded-xl border bg-card/80 p-4 backdrop-blur-md shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employee by name, code, or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 bg-background/80"
          />
          {searchInput && (
            <button
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
            onClick={onOpenGenerateModal}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Generate Payroll
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
          Filters:
        </div>

        {/* Month Filter */}
        <select
          value={queryParams.month ?? "ALL"}
          onChange={(e) => {
            const val = e.target.value === "ALL" ? "ALL" : Number(e.target.value);
            onFilterChange({ month: val, page: 1 });
          }}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">All Months</option>
          {MONTH_NAMES.map((name, index) => (
            <option key={index + 1} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={queryParams.year ?? "ALL"}
          onChange={(e) => {
            const val = e.target.value === "ALL" ? "ALL" : Number(e.target.value);
            onFilterChange({ year: val, page: 1 });
          }}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">All Years</option>
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
        </select>

        {/* Status Filter */}
        <select
          value={queryParams.status || "ALL"}
          onChange={(e) =>
            onFilterChange({
              status: e.target.value as PayrollStatus | "ALL",
              page: 1,
            })
          }
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="GENERATED">Generated</option>
          <option value="PAID">Paid</option>
        </select>

        {/* Sort By */}
        <select
          value={queryParams.sort || "createdAt"}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="createdAt">Sort by: Date Created</option>
          <option value="employeeName">Sort by: Employee Name</option>
          <option value="yearMonth">Sort by: Period (Month/Year)</option>
          <option value="netSalary">Sort by: Net Salary</option>
          <option value="status">Sort by: Payment Status</option>
        </select>


        {/* Sort Order */}
        <select
          value={queryParams.order || "desc"}
          onChange={(e) =>
            onFilterChange({ order: e.target.value as "asc" | "desc" })
          }
          className="h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
};
