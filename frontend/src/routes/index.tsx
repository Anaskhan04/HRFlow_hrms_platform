import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import EmployeeListPage from "../pages/EmployeeListPage";
import DepartmentListPage from "../pages/DepartmentListPage";
import PlaceholderPage from "../pages/PlaceholderPage";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "employees",
        element: <EmployeeListPage />,
      },
      {
        path: "organizations",
        element: (
          <PlaceholderPage
            title="Organization Setup"
            moduleName="Organization"
            description="Manage global entities, multi-branch setups, timezone settings, and corporate configurations."
          />
        ),
      },
      {
        path: "departments",
        element: <DepartmentListPage />,
      },
      {
        path: "leaves",
        element: (
          <PlaceholderPage
            title="Leave Management"
            moduleName="Leave Workflow"
            description="Submit leave requests, review pending approvals, and track employee time-off balances. Scheduled for upcoming sprint."
          />
        ),
      },
      {
        path: "attendance",
        element: (
          <PlaceholderPage
            title="Attendance Tracking"
            moduleName="Attendance"
            description="Daily employee check-in and check-out logs, automated working hour calculations, and historical records."
          />
        ),
      },
      {
        path: "payroll",
        element: (
          <PlaceholderPage
            title="Payroll Processing"
            moduleName="Payroll"
            description="Generate monthly salary slips, calculate net pay with allowances and deductions, and process payments."
          />
        ),
      },
      {
        path: "settings",
        element: (
          <PlaceholderPage
            title="System Settings"
            moduleName="Enterprise Settings"
            description="Configure security policies, role permissions, notification preferences, and API integrations."
          />
        ),
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
