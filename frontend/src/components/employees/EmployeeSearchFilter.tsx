import React, { useState, useEffect } from "react";
import { Search, Filter, X, ArrowUpDown, UserPlus } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useDepartments } from "../../hooks/useDepartments";
import type { EmployeeQueryParams } from "../../types";

interface EmployeeSearchFilterProps {
  queryParams: EmployeeQueryParams;
  onFilterChange: (newParams: Partial<EmployeeQueryParams>) => void;
  onReset: () => void;
  onOpenAddModal: () => void;
}

export const EmployeeSearchFilter: React.FC<EmployeeSearchFilterProps> = ({
  queryParams,
  onFilterChange,
  onReset,
  onOpenAddModal,
}) => {
  const { data: departments = [] } = useDepartments();
  const [searchInput, setSearchInput] = useState(queryParams.search || "");

  // Update local search state if queryParams.search changes externally
  useEffect(() => {
    setSearchInput(queryParams.search || "");
  }, [queryParams.search]);

  // Debounced auto-search or enter trigger
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
    (queryParams.department && queryParams.department !== "ALL") ||
    (queryParams.status && queryParams.status !== "ALL") ||
    (queryParams.sort && queryParams.sort !== "createdAt");

  return (
    <div className="space-y-4 rounded-xl border bg-card/80 p-4 backdrop-blur-md shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, or employee code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 pr-9 bg-background"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                onFilterChange({ search: "", page: 1 });
              }}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Add Employee Action */}
        <Button onClick={onOpenAddModal} className="gap-2 font-semibold shadow-md">
          <UserPlus className="h-4 w-4" />
          <span>Add Employee</span>
        </Button>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <Filter className="h-4 w-4 text-primary" />
          <span>Filters:</span>
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Department:</span>
          <select
            value={queryParams.department || "ALL"}
            onChange={(e) => onFilterChange({ department: e.target.value, page: 1 })}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Status:</span>
          <select
            value={queryParams.status || "ALL"}
            onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-1 ml-auto">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground mr-0.5" />
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <select
            value={queryParams.sort || "createdAt"}
            onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="createdAt">Date Created</option>
            <option value="joiningDate">Joining Date</option>
            <option value="firstName">First Name</option>
          </select>

          <select
            value={queryParams.order || "desc"}
            onChange={(e) => onFilterChange({ order: e.target.value as "asc" | "desc", page: 1 })}
            className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 px-2.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmployeeSearchFilter;
