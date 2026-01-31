import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/useAuth";
import { useSelector } from "react-redux";
import { selectAuthLoading } from "../store/auth/authThunks";
import { Box, CircularProgress } from "@mui/material";

export default function RequireAuth() {
  const isAuthenticated = useIsAuthenticated();
  const loading = useSelector(selectAuthLoading);
  const location = useLocation();
  console.log(
    "RequireAuth - isAuthenticated:",
    isAuthenticated,
    "loading:",
    loading
  );
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

  return <Outlet />;
}
