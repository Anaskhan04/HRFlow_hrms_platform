import React, { useState } from "react";
import { Users, Sparkles, RefreshCw } from "lucide-react";
import { useEmployees } from "../hooks/useEmployees";
import EmployeeSearchFilter from "../components/employees/EmployeeSearchFilter";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeePagination from "../components/employees/EmployeePagination";
import AddEmployeeModal from "../components/employees/AddEmployeeModal";
import EditEmployeeModal from "../components/employees/EditEmployeeModal";
import DeleteEmployeeDialog from "../components/employees/DeleteEmployeeDialog";
import { Button } from "../components/ui/button";
import { cn } from "../utils/cn";
import type { Employee, EmployeeQueryParams } from "../types";

export const EmployeeListPage: React.FC = () => {
  const [queryParams, setQueryParams] = useState<EmployeeQueryParams>({
    page: 1,
    limit: 10,
    search: "",
    department: "ALL",
    status: "ALL",
    sort: "createdAt",
    order: "desc",
  });

  // Modal control states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useEmployees(queryParams);

  const employees = data?.employees || [];
  const pagination = data?.pagination || {
    page: queryParams.page || 1,
    limit: queryParams.limit || 10,
    total: 0,
    totalPages: 1,
  };

  const handleFilterChange = (newParams: Partial<EmployeeQueryParams>) => {
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
      department: "ALL",
      status: "ALL",
      sort: "createdAt",
      order: "desc",
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/10 text-indigo-200 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Workforce Directory Module</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl flex items-center gap-3">
            <Users className="h-8 w-8 text-indigo-400" />
            <span>Employee Management</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Search, sort, filter, and manage staff records across all corporate departments and branches.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 self-start md:self-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/10 shadow-sm"
          >
            <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
            <span>{isFetching ? "Syncing..." : "Sync Directory"}</span>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive flex items-center justify-between">
          <span>{error?.message || "Failed to load employees from backend server."}</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Search, Filter & Action Controls */}
      <EmployeeSearchFilter
        queryParams={queryParams}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Employee Data Table */}
      <EmployeeTable
        employees={employees}
        isLoading={isLoading}
        onEdit={(emp) => setEditingEmployee(emp)}
        onDelete={(emp) => setDeletingEmployee(emp)}
      />

      {/* Pagination Controls */}
      <EmployeePagination
        pagination={pagination}
        onPageChange={(newPage) => handleFilterChange({ page: newPage })}
        onLimitChange={(newLimit) => handleFilterChange({ limit: newLimit, page: 1 })}
      />

      {/* Modals & Dialogs */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditEmployeeModal
        employee={editingEmployee}
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
      />

      <DeleteEmployeeDialog
        employee={deletingEmployee}
        isOpen={!!deletingEmployee}
        onClose={() => setDeletingEmployee(null)}
      />
    </div>
  );
};

export default EmployeeListPage;
