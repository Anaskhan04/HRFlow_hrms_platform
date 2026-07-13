import React from "react";
import { useDashboardSummary } from "../hooks/useDashboard";
import { useAuth } from "../hooks/useAuth";
import { DashboardAnalyticsSection } from "../components/dashboard/DashboardAnalyticsSection";
import {
  Users,
  Building2,
  UserCheck,
  Calendar,
  AlertCircle,
  Wallet,
  RefreshCw,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { cn } from "../utils/cn";


export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: summary, isLoading, isError, error, refetch, isFetching } = useDashboardSummary();

  const attendanceRate =
    summary && summary.totalEmployees > 0
      ? Math.round((summary.todayPresent / summary.totalEmployees) * 100)
      : 0;

  const statCards = [
    {
      title: "Total Employees",
      value: summary ? summary.totalEmployees.toLocaleString() : "0",
      subtext: summary ? `${summary.activeEmployees} active workforce headcount` : "Loading...",
      icon: Users,
      badge: "Headcount",
      badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      borderGlow: "hover:border-blue-500/40",
    },
    {
      title: "Active Departments",
      value: summary ? summary.departments.toLocaleString() : "0",
      subtext: "Organized operational units",
      icon: Building2,
      badge: "Structure",
      badgeColor: "bg-violet-500/10 text-violet-500 border-violet-500/20",
      iconBg: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      borderGlow: "hover:border-violet-500/40",
    },
    {
      title: "Present Today",
      value: summary ? summary.todayPresent.toLocaleString() : "0",
      subtext: summary ? `${attendanceRate}% daily attendance rate` : "Loading...",
      icon: UserCheck,
      badge: "Live Status",
      badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      borderGlow: "hover:border-emerald-500/40",
    },
    {
      title: "On Leave Today",
      value: summary ? summary.todayOnLeave.toLocaleString() : "0",
      subtext: "Employees away from office",
      icon: Calendar,
      badge: "Absence",
      badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      borderGlow: "hover:border-amber-500/40",
    },
    {
      title: "Pending Leaves",
      value: summary ? summary.pendingLeaveRequests.toLocaleString() : "0",
      subtext: "Requires HR or admin approval",
      icon: AlertCircle,
      badge: "Action Req",
      badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      iconBg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      borderGlow: "hover:border-orange-500/40",
    },
    {
      title: "Monthly Payroll",
      value: summary
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(
            summary.monthlyPayroll
          )
        : "$0",
      subtext: "Total monthly salary budget",
      icon: Wallet,
      badge: "Finance",
      badgeColor: "bg-teal-500/10 text-teal-500 border-teal-500/20",
      iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
      borderGlow: "hover:border-teal-500/40",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/10 text-blue-200 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Sprint 14 Analytics Live</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Welcome back, {user?.email?.split("@")[0] || "Executive"}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Here is your real-time overview of workforce headcount, attendance metrics, pending leaves, and payroll budgets.
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
            <span>{isFetching ? "Refreshing..." : "Refresh Metrics"}</span>
          </Button>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <Card className="border-destructive/40 bg-destructive/5 p-6 text-center animate-fade-in">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-destructive">Failed to load dashboard summary</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
            {error?.message || "An unexpected error occurred while communicating with the backend server."}
          </p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-4 gap-2">
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        </Card>
      )}

      {/* Statistic Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse p-6 space-y-4 bg-card/60">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-9 w-9 rounded-xl bg-muted" />
                </div>
                <div className="h-8 w-32 rounded bg-muted" />
                <div className="h-3 w-40 rounded bg-muted" />
              </Card>
            ))
          : statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Card
                  key={idx}
                  className={cn(
                    "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border bg-card/90 backdrop-blur-sm",
                    card.borderGlow
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110", card.iconBg)}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline justify-between">
                      <div className="text-3xl font-extrabold tracking-tight text-foreground">
                        {card.value}
                      </div>
                      <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border", card.badgeColor)}>
                        {card.badge}
                      </span>
                    </div>
                    <p className="mt-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-500 inline shrink-0" />
                      <span>{card.subtext}</span>
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Dashboard Interactive Analytics Section (Recharts) */}
      <DashboardAnalyticsSection />

      {/* Quick Action & System Health Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/80 backdrop-blur-sm border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              <span>Enterprise Architecture Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between border-b pb-2">
              <span>JWT Authentication Interceptor</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Active
              </span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>TanStack Query Caching & Stale Time</span>
              <span className="font-semibold text-foreground">2 Minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Analytics API Connection</span>
              <span className="font-semibold text-foreground">/api/v1/dashboard/analytics</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Completed Core Modules</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-between border-b pb-2">
              <span>Employees & Departments Directory</span>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Completed</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>Leave, Attendance & Payroll Management</span>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Profile, Settings & Recharts Analytics</span>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Completed</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

