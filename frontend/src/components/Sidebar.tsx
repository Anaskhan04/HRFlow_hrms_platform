import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Network,
  CalendarDays,
  Clock,
  Wallet,
  Settings,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "../utils/cn";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Employees", href: "/employees", icon: Users },
  { label: "Organizations", href: "/organizations", icon: Building2 },
  { label: "Departments", href: "/departments", icon: Network },
  { label: "Leave Requests", href: "/leaves", icon: CalendarDays },
  { label: "Attendance", href: "/attendance", icon: Clock },
  { label: "Payroll", href: "/payroll", icon: Wallet },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-lg lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-md shadow-primary/20">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1">
              HRFlow <Sparkles className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Enterprise SaaS
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            Main Menu
          </div>
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.href}
                  to={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024 && onClose) onClose();
                  }}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-transform group-hover:scale-110",
                            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4 opacity-80" />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / System Status */}
        <div className="border-t p-4 m-4 rounded-xl bg-muted/40 border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-medium text-foreground">System Online</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">v1.0.0</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            All services connected & encrypted.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
