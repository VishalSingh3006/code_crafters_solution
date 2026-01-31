import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import TwoFactorSetup from "../pages/TwoFactorSetup";
import RolesPage from "../pages/Roles";
import ClientsPage from "../pages/Clients";
import ResourceTrackingDashboard from "../pages/ResourceTracking";
import DeliveryPage from "../pages/ResourceTracking/DeliveryPage";
import StaffingPage from "../pages/ResourceTracking/StaffingPage";
import EmployeesPage from "../pages/Employees";
import CreateEmployeePage from "../pages/Employees/Create";

const AppRoutes: React.FC = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/2fa-setup"
        element={
          <ProtectedRoute>
            <TwoFactorSetup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-tracking"
        element={
          <ProtectedRoute>
            <ResourceTrackingDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-tracking/deliveries"
        element={
          <ProtectedRoute>
            <DeliveryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-tracking/staffing"
        element={
          <ProtectedRoute>
            <StaffingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roles"
        element={
          <ProtectedRoute>
            <RolesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees/create"
        element={
          <ProtectedRoute>
            <CreateEmployeePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
