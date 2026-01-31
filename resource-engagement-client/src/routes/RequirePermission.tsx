import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import {
  selectAuthLoading,
  selectIsAuthenticated,
} from "../store/auth/authThunks";
import type { Permission } from "../types/rbac";
import { useAllPermissions } from "../hooks/useRbac";

export default function RequirePermission({
  required,
}: {
  required: Permission[];
}) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const hasRequired = useAllPermissions(required);
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequired) {
    return (
      <Navigate
        to="/error"
        state={{ from: location, reason: "forbidden" }}
        replace
      />
    );
  }

  return <Outlet />;
}
