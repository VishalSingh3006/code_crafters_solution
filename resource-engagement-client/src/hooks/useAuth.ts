import { useContext } from "react";
import { AuthContext } from "../contexts/auth/AuthProvider";
import { selectIsAuthenticated } from "../store/auth/authThunks";
import { useAppSelector } from "../store/store";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Hook to check authentication status from Redux
export function useIsAuthenticated() {
  return useAppSelector(selectIsAuthenticated);
}
