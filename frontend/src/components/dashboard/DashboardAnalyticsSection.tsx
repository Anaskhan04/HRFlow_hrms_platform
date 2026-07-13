import React from "react";
import { useDashboardAnalytics } from "../../hooks/useDashboard";
import { EmployeeGrowthChart } from "./EmployeeGrowthChart";
import { DepartmentDistributionChart } from "./DepartmentDistributionChart";
import { LeaveStatusChart } from "./LeaveStatusChart";
import { AttendanceTrendChart } from "./AttendanceTrendChart";
import { PayrollDistributionChart } from "./PayrollDistributionChart";
import { AlertCircle, RefreshCw, BarChart3, Inbox } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export const DashboardAnalyticsSection: React.FC = () => {
  const { data: analytics, isLoading, isError, error, refetch, isFetching } = useDashboardAnalytics();

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span>Executive Dashboard Analytics</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time interactive visualizations of workforce and financial metrics
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse p-6 space-y-4 bg-card/60 h-[380px]">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-44 rounded bg-muted" />
                  <div className="h-3 w-64 rounded bg-muted" />
                </div>
                <div className="h-7 w-24 rounded-full bg-muted" />
              </div>
              <div className="h-[270px] w-full rounded-xl bg-muted/50" />
            </Card>
          ))}
        </div>
        <Card className="animate-pulse p-6 space-y-4 bg-card/60 h-[380px]">
          <div className="flex items-center justify-between">
            <div className="h-5 w-56 rounded bg-muted" />
            <div className="h-7 w-28 rounded-full bg-muted" />
          </div>
          <div className="h-[270px] w-full rounded-xl bg-muted/50" />
        </Card>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <Card className="border-destructive/40 bg-destructive/5 p-8 text-center animate-fade-in my-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-destructive">Failed to Load Dashboard Analytics</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
          {error?.message || "Unable to fetch analytics datasets from the server. Please check your network connection."}
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-5 gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Retry Loading Charts</span>
        </Button>
      </Card>
    );
  }

  // Empty State (if no analytics data exists)
  if (!analytics) {
    return (
      <Card className="border p-12 text-center bg-card/80 backdrop-blur-sm my-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <Inbox className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Analytics Data Available</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
          There are currently no records to visualize. Add employees, departments, and payroll data to activate charts.
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="mt-5 gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Analytics</span>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 pt-2 animate-fade-in">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>Interactive Workforce Analytics</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live Recharts data visualizations integrating Headcount, Structure, Leaves, Attendance & Payroll
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="gap-2 text-xs h-8"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>{isFetching ? "Syncing..." : "Sync Charts"}</span>
          </Button>
        </div>
      </div>

      {/* Charts Grid - Row 1: Employee Growth + Department Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <EmployeeGrowthChart data={analytics.employeeGrowth} />
        <DepartmentDistributionChart data={analytics.departmentDistribution} />
      </div>

      {/* Charts Grid - Row 2: Attendance Trend + Leave Status */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AttendanceTrendChart data={analytics.attendanceTrend} />
        <LeaveStatusChart data={analytics.leaveStatusDistribution} />
      </div>

      {/* Charts Grid - Row 3: Payroll Distribution across Departments */}
      <div className="grid gap-6 grid-cols-1">
        <PayrollDistributionChart data={analytics.payrollDistribution} />
      </div>
    </div>
  );
};

export default DashboardAnalyticsSection;
