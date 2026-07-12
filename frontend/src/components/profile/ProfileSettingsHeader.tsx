import React from "react";
import { User as UserIcon, Shield, Building2, Sparkles, CheckCircle2 } from "lucide-react";
import type { User } from "../../types";

interface ProfileSettingsHeaderProps {
  user: User | null;
  activeTab: "profile" | "security" | "preferences";
  onTabChange: (tab: "profile" | "security" | "preferences") => void;
}

export const ProfileSettingsHeader: React.FC<ProfileSettingsHeaderProps> = ({
  user,
  activeTab,
  onTabChange,
}) => {
  const employee = user?.employee;
  const fullName = employee
    ? `${employee.firstName} ${employee.lastName}`
    : user?.email?.split("@")[0] || "User Profile";

  const designation = employee?.designation || "Administrator";
  const orgName = employee?.organization?.name || "HRFlow Enterprise HQ";
  const employeeCode = employee?.employeeCode || "EMP-ADMIN";

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
      {/* Background Banner Gradient */}
      <div className="h-32 bg-gradient-to-r from-primary/90 via-blue-600 to-indigo-600 p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Account Management & Preferences
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-100 border border-emerald-400/30 backdrop-blur-md">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Verified Profile
          </span>
        </div>
      </div>

      {/* User Avatar & Overview Card */}
      <div className="relative px-6 pb-6 pt-0">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left -mt-12">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-primary to-blue-700 text-3xl font-bold text-white shadow-xl">
              {fullName[0]?.toUpperCase() || <UserIcon className="h-10 w-10" />}
            </div>

            <div className="flex flex-col sm:pt-12">
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {fullName}
                </h1>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-mono font-semibold text-primary">
                  {employeeCode}
                </span>
              </div>

              <p className="text-sm font-medium text-muted-foreground mt-0.5">
                {designation} &bull; {user?.email}
              </p>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Shield className="h-3 w-3" />
                  Role: {user?.role || "ADMIN"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  {orgName}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-t sm:border-t-0 pt-4 sm:pt-0 w-full sm:w-auto">
            <div className="grid w-full grid-cols-3 gap-1 rounded-xl bg-muted p-1 sm:w-auto">
              <button
                type="button"
                onClick={() => onTabChange("profile")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "profile"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Profile Information
              </button>
              <button
                type="button"
                onClick={() => onTabChange("security")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "security"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Security & Password
              </button>
              <button
                type="button"
                onClick={() => onTabChange("preferences")}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === "preferences"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
