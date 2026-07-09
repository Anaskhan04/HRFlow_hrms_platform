import React from "react";
import { Edit2, Trash2, Users, Mail, Calendar, Building, DollarSign } from "lucide-react";
import { Button } from "../ui/button";
import type { Employee, EmployeeStatus } from "../../types";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const getStatusBadge = (status: EmployeeStatus) => {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </span>
      );
    case "ON_LEAVE":
      return (
        <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
          On Leave
        </span>
      );
    case "INACTIVE":
      return (
        <span className="inline-flex items-center rounded-full bg-slate-500/10 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-500/20">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-slate-500" />
          Inactive
        </span>
      );
    case "TERMINATED":
      return (
        <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive border border-destructive/20">
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          Terminated
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card/60 overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-muted/40 font-medium text-xs text-muted-foreground flex justify-between">
          <span>Loading employee directory...</span>
        </div>
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-muted" />
                  <div className="h-3 w-48 rounded bg-muted" />
                </div>
              </div>
              <div className="h-4 w-24 rounded bg-muted hidden md:block" />
              <div className="h-6 w-16 rounded-full bg-muted" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded bg-muted" />
                <div className="h-8 w-8 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="rounded-xl border bg-card/60 p-12 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <Users className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No employees found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
          No employee records match your current search and filter criteria. Try adjusting your filters or adding a new employee.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-3.5 px-4">Employee</th>
              <th className="py-3.5 px-4">Code</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Designation</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Department</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Joining Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm font-normal">
            {employees.map((emp) => {
              const initials = `${emp.firstName.charAt(0)}${emp.lastName.charAt(0)}`.toUpperCase();
              const formattedDate = new Date(emp.joiningDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <tr
                  key={emp.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  {/* Employee Info */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary text-xs ring-2 ring-primary/20">
                        {initials}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Mail className="h-3 w-3 inline shrink-0" />
                          <span className="truncate max-w-[160px] sm:max-w-xs">{emp.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Code */}
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-foreground">
                    {emp.employeeCode}
                  </td>

                  {/* Designation */}
                  <td className="py-3.5 px-4 hidden md:table-cell text-muted-foreground">
                    <div className="font-medium text-foreground">{emp.designation}</div>
                    {emp.salary ? (
                      <div className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                        <DollarSign className="h-3 w-3 inline" />
                        <span>{emp.salary.toLocaleString()} / yr</span>
                      </div>
                    ) : null}
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    {emp.department ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        <Building className="h-3 w-3" />
                        {emp.department.name}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Unassigned</span>
                    )}
                  </td>

                  {/* Joining Date */}
                  <td className="py-3.5 px-4 hidden sm:table-cell text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{formattedDate}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {getStatusBadge(emp.status)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(emp)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Edit Employee"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(emp)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete Employee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;
