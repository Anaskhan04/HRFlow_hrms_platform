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

export interface EmployeeGrowthItem {
  period: string;
  employees: number;
}

export interface DepartmentDistributionItem {
  name: string;
  count: number;
}

export interface LeaveStatusDistributionItem {
  status: string;
  count: number;
  fill?: string;
}

export interface AttendanceTrendItem {
  day: string;
  present: number;
  onLeave: number;
  absent: number;
}

export interface PayrollDistributionItem {
  department: string;
  netSalary: number;
  headcount: number;
}

export interface DashboardAnalytics {
  employeeGrowth: EmployeeGrowthItem[];
  departmentDistribution: DepartmentDistributionItem[];
  leaveStatusDistribution: LeaveStatusDistributionItem[];
  attendanceTrend: AttendanceTrendItem[];
  payrollDistribution: PayrollDistributionItem[];
}

export interface DashboardAnalyticsResponse extends DashboardAnalytics {
  success: boolean;
  data?: DashboardAnalytics;
}

