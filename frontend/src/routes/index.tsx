import React from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import EmployeeListPage from "../pages/EmployeeListPage";
import DepartmentListPage from "../pages/DepartmentListPage";
import LeaveListPage from "../pages/LeaveListPage";
import { AttendanceListPage } from "../pages/AttendanceListPage";
import { PayrollListPage } from "../pages/PayrollListPage";
import { ProfilePage } from "../pages/ProfilePage";
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
        element: <LeaveListPage />,
      },
      {
        path: "attendance",
        element: <AttendanceListPage />,
      },
      {
        path: "payroll",
        element: <PayrollListPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "settings",
        element: <ProfilePage />,
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
