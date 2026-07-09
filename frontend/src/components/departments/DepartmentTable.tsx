import React from "react";
import { Edit2, Trash2, FolderTree, Building2, Layers } from "lucide-react";
import type { Department } from "../../types";
import { Button } from "../ui/button";

interface DepartmentTableProps {
  departments: Department[];
  isLoading: boolean;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border/40 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-muted" />
                  <div className="h-3 w-64 rounded bg-muted" />
                </div>
              </div>
              <div className="h-8 w-20 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <div className="rounded-xl border bg-card/50 p-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 mb-4 text-indigo-500">
          <FolderTree className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Departments Found</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">
          No corporate departments matched your search criteria. Try clearing your search filter or adding a new department.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3.5">Department</th>
              <th className="px-6 py-3.5">Description</th>
              <th className="px-6 py-3.5">Organization</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {departments.map((dept) => (
              <tr
                key={dept.id}
                className="group hover:bg-muted/30 transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground block">
                        {dept.name}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        ID: {dept.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 max-w-xs">
                  <p className="text-sm text-muted-foreground truncate">
                    {dept.description || "No description provided"}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                    <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                    <span>HRFlow Global</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(dept)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-indigo-600"
                      title="Edit Department"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(dept)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      title="Delete Department"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentTable;
