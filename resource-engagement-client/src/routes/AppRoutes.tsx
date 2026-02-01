import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ChangePassword from "../pages/ChangePassword";
import Dashboard from "../pages/Dashboard";
import ProfileEdit from "../pages/Profile";
import ProfileDetail from "../pages/Profile/Detail";
import TwoFactorSetup from "../pages/TwoFactorSetup";
import RolesPage from "../pages/Roles";
import ClientsPage from "../pages/Clients";
import CreateClientPage from "../pages/Clients/Create";
import ClientDetailPage from "../pages/Clients/Detail";
import ProjectsPage from "../pages/Projects";
import CreateProjectPage from "../pages/Projects/Create";
import ProjectDetailPage from "../pages/Projects/Detail";
import ResourceTrackingDashboard from "../pages/ResourceTracking";
import DeliveryPage from "../pages/ResourceTracking/DeliveryPage";
import StaffingPage from "../pages/ResourceTracking/StaffingPage";
import RecruitmentPage from "../pages/ResourceTracking/RecruitmentPage";
import EmployeesPage from "../pages/Employees";
import CreateEmployeePage from "../pages/Employees/Create";
import EmployeeDetailPage from "../pages/Employees/Detail";
import DepartmentsPage from "../pages/Departments";
import CreateDepartmentPage from "../pages/Departments/Create";
import DesignationsPage from "../pages/Designations";
import BillingPage from "../components/ResourceTracking/BillingPage";
import BillingRates from "../pages/BillingRates";
import SkillsManagement from "../components/SkillsManagement";
import PortfolioCompanyManagement from "../components/PortfolioCompanyManagement";
import { EngagementManagementPage } from "../pages/EngagementManagementPage";
import EngagementDetailPage from "../pages/EngagementDetailPage";

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
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <ForgotPassword />
          )
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
            <ProfileDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
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
        path="/resource-tracking"
        element={
          <ProtectedRoute>
            <ResourceTrackingDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-tracking/billing"
        element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-tracking/billing/rates"
        element={
          <ProtectedRoute>
            <BillingRates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resource-tracking/recruitment"
        element={
          <ProtectedRoute>
            <RecruitmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/designations"
        element={
          <ProtectedRoute>
            <DesignationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/skills"
        element={
          <ProtectedRoute>
            <SkillsManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portfolio-companies"
        element={
          <ProtectedRoute>
            <PortfolioCompanyManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/engagements"
        element={
          <ProtectedRoute>
            <EngagementManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/engagements/:id"
        element={
          <ProtectedRoute>
            <EngagementDetailPage />
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
        path="/clients/create"
        element={
          <ProtectedRoute>
            <CreateClientPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute>
            <ClientDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/create"
        element={
          <ProtectedRoute>
            <CreateProjectPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetailPage />
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
        path="/employees/:id"
        element={
          <ProtectedRoute>
            <EmployeeDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedRoute>
            <DepartmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments/create"
        element={
          <ProtectedRoute>
            <CreateDepartmentPage />
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
