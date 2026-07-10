import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface AttendancePaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export const AttendancePagination: React.FC<AttendancePaginationProps> = ({
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
      {/* Summary info */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>
          Showing <span className="font-semibold text-foreground">{startIdx}</span>{" "}
          to <span className="font-semibold text-foreground">{endIdx}</span> of{" "}
          <span className="font-semibold text-foreground">{total}</span> entries
        </span>

        {/* Page size select */}
        <div className="flex items-center gap-1.5 border-l pl-4">
          <span>Rows per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border bg-background px-2 py-1 text-xs text-foreground shadow-sm focus:border-primary focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
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

        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === "number" ? (
              <Button
                key={idx}
                variant={p === page ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 p-0 text-xs ${
                  p === page ? "font-bold shadow-sm" : ""
                }`}
              >
                {p}
              </Button>
            ) : (
              <span
                key={idx}
                className="px-1.5 text-xs text-muted-foreground select-none"
              >
                {p}
              </span>
            )
          )}
        </div>

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
  );
};
