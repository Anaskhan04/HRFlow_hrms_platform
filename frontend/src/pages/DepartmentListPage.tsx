import React, { useState, useMemo } from "react";
import { FolderTree, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { useDepartments } from "../hooks/useDepartments";
import {
  DepartmentSearchFilter,
  DepartmentTable,
  DepartmentPagination,
  AddDepartmentModal,
  EditDepartmentModal,
  DeleteDepartmentDialog,
} from "../components/departments";
import type { Department } from "../types";
import { cn } from "../utils/cn";

export const DepartmentListPage: React.FC = () => {
  const {
    data: allDepartments = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useDepartments();

  // Search and Pagination State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal / Dialog States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null
  );
  const [deletingDepartment, setDeletingDepartment] =
    useState<Department | null>(null);

  // Filter departments by search string
  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return allDepartments;
    const query = search.toLowerCase();
    return allDepartments.filter(
      (dept) =>
        dept.name.toLowerCase().includes(query) ||
        (dept.description && dept.description.toLowerCase().includes(query))
    );
  }, [allDepartments, search]);

  // Paginate filtered departments
  const total = filteredDepartments.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedDepartments = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return filteredDepartments.slice(startIndex, startIndex + limit);
  }, [filteredDepartments, page, limit]);

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page on search
  };

  const handleResetSearch = () => {
    setSearch("");
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/10 text-indigo-200 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Corporate Structure Module</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl flex items-center gap-3">
            <FolderTree className="h-8 w-8 text-indigo-400" />
            <span>Department Management</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Configure functional business units, oversee organizational hierarchies, and manage departmental descriptions.
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
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
            <span>{isFetching ? "Syncing..." : "Sync Directory"}</span>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive flex items-center justify-between">
          <span>
            {error?.message ||
              "Failed to load departments from backend server."}
          </span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Search & Action Controls */}
      <DepartmentSearchFilter
        search={search}
        onSearchChange={handleSearchChange}
        onReset={handleResetSearch}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Department Data Table */}
      <DepartmentTable
        departments={paginatedDepartments}
        isLoading={isLoading}
        onEdit={(dept) => setEditingDepartment(dept)}
        onDelete={(dept) => setDeletingDepartment(dept)}
      />

      {/* Pagination Controls */}
      <DepartmentPagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={(newPage) => setPage(newPage)}
        onLimitChange={handleLimitChange}
      />

      {/* Add Department Modal */}
      <AddDepartmentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Edit Department Modal */}
      <EditDepartmentModal
        department={editingDepartment}
        isOpen={!!editingDepartment}
        onClose={() => setEditingDepartment(null)}
      />

      {/* Delete Department Dialog */}
      <DeleteDepartmentDialog
        department={deletingDepartment}
        isOpen={!!deletingDepartment}
        onClose={() => setDeletingDepartment(null)}
      />
    </div>
  );
};

export default DepartmentListPage;
