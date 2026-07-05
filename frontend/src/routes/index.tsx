import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
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
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <PlaceholderPage
            title="Dashboard Overview"
            moduleName="Dashboard Analytics"
            description="High-level company metrics, active headcounts, leave summaries, and monthly payroll expenditure will be displayed here."
          />
        ),
      },
      {
        path: "employees",
        element: (
          <PlaceholderPage
            title="Employee Management"
            moduleName="Employee"
            description="Comprehensive employee directory with pagination, advanced search across email/name/code, sorting, and department filtering."
          />
        ),
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
        element: (
          <PlaceholderPage
            title="Department Hierarchy"
            moduleName="Department"
            description="Organize corporate structure, department heads, budgets, and operational teams."
          />
        ),
      },
      {
        path: "leaves",
        element: (
          <PlaceholderPage
            title="Leave Management"
            moduleName="Leave Workflow"
            description="Submit leave requests, review pending approvals, and track employee time-off balances."
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
