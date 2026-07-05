export interface DashboardSummary {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  todayPresent: number;
  todayOnLeave: number;
  pendingLeaveRequests: number;
  monthlyPayroll: number;
}

export interface DashboardSummaryResponse extends DashboardSummary {
  success: boolean;
  data?: DashboardSummary;
}
