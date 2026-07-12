import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface PayrollPaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export const PayrollPagination: React.FC<PayrollPaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const { page, limit, total, totalPages } = pagination;

  const startIdx = total === 0 ? 0 : (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm md:flex-row">
      <div className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{startIdx}</span>{" "}
        to <span className="font-semibold text-foreground">{endIdx}</span> of{" "}
        <span className="font-semibold text-foreground">{total}</span> payroll
        records
      </div>

      <div className="flex items-center gap-4">
        {/* Page limit selector */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((p, idx) =>
            typeof p === "string" ? (
              <span
                key={idx}
                className="px-2 text-xs font-semibold text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={idx}
                variant={page === p ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(p)}
                className="h-8 min-w-8 px-2 text-xs"
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
