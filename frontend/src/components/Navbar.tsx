import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import {
  Sun,
  Moon,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  Shield,
  Menu,
} from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search employees, reports, or policies..."
            className="flex h-9 w-full rounded-full border border-input bg-muted/50 pl-9 pr-4 text-sm transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full text-muted-foreground hover:text-foreground"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700 transition-transform hover:-rotate-12" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-muted-foreground hover:text-foreground"
          title="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
        </Button>

        <div className="h-6 w-[1px] bg-border mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-1">
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-full hover:opacity-80 transition-opacity"
            title="View Profile & Settings"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">
              {user?.email ? user.email[0].toUpperCase() : <UserIcon className="h-4 w-4" />}
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-sm font-medium leading-none text-foreground">
                {user?.email || "Admin User"}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase mt-1">
                <Shield className="h-3 w-3 text-primary inline" />
                {user?.role || "ADMIN"}
              </span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 ml-1 rounded-full transition-colors"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
