import React, { useState, useEffect } from "react";
import { Search, X, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface DepartmentSearchFilterProps {
  search: string;
  onSearchChange: (search: string) => void;
  onReset: () => void;
  onOpenAddModal: () => void;
}

export const DepartmentSearchFilter: React.FC<DepartmentSearchFilterProps> = ({
  search,
  onSearchChange,
  onReset,
  onOpenAddModal,
}) => {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== search) {
        onSearchChange(searchInput);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput, search, onSearchChange]);

  return (
    <div className="space-y-4 rounded-xl border bg-card/80 p-4 backdrop-blur-md shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search departments by name or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 pr-9 bg-background"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                onSearchChange("");
              }}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear Search
            </Button>
          )}

          {/* Add Department Action */}
          <Button onClick={onOpenAddModal} className="gap-2 font-semibold shadow-md">
            <PlusCircle className="h-4 w-4" />
            <span>Add Department</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSearchFilter;
