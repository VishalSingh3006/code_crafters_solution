import { useSelector } from "react-redux";
import { useEffect, useCallback } from "react";
import type { RootState } from "../store/store";
import { useAppDispatch } from "../store/store";
import { clearAuth, setToken } from "../store/auth/authSlice";
import { isValidToken, getTokenTimeRemaining } from "../utils/jwt";

/**
 * Custom hook for JWT token management
 * Provides token validation, expiration checking, and automatic cleanup
 */
export function useJwtToken() {
  const dispatch = useAppDispatch();
  const { accessToken, decodedToken, tokenExpiry, isAuthenticated } =
    useSelector((state: RootState) => state.auth);

  /**
   * Check if the current token is valid and not expired
   */
  const isTokenValid = useCallback((): boolean => {
    if (!accessToken) return false;
    return isValidToken(accessToken);
  }, [accessToken]);

  /**
   * Get the time remaining until token expires (in seconds)
   */
  const getTimeUntilExpiry = useCallback((): number => {
    if (!accessToken) return 0;
    return getTokenTimeRemaining(accessToken);
  }, [accessToken]);

  /**
   * Check if token will expire within the specified minutes
   */
  const willExpireSoon = useCallback(
    (minutesThreshold: number = 5): boolean => {
      const timeRemaining = getTimeUntilExpiry();
      return timeRemaining <= minutesThreshold * 60;
    },
    [getTimeUntilExpiry]
  );

  /**
   * Manually refresh/set a new token
   */
  const refreshToken = useCallback(
    (newToken: string) => {
      if (isValidToken(newToken)) {
        dispatch(setToken(newToken));
      } else {
        console.error("Attempted to set invalid token");
        dispatch(clearAuth());
      }
    },
    [dispatch]
  );

  /**
   * Clear the current token and log out
   */
  const clearToken = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  /**
   * Get user information from the decoded token
   */
  const getUserFromJwt = useCallback(() => {
    return decodedToken
      ? {
          id: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.name,
          roles: decodedToken.roles,
        }
      : null;
  }, [decodedToken]);

  /**
   * Check if user has specific role/permission
   */
  const hasRole = useCallback(
    (role: string): boolean => {
      return decodedToken?.roles?.includes(role) ?? false;
    },
    [decodedToken]
  );

  // Auto-cleanup expired tokens
  useEffect(() => {
    if (accessToken && !isTokenValid()) {
      console.warn("Token is expired, clearing auth state");
      dispatch(clearAuth());
    }
  }, [accessToken, isTokenValid, dispatch]);

  // Set up automatic token expiration check
  useEffect(() => {
    if (!accessToken || !isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (!isTokenValid()) {
        console.warn("Token expired during session, logging out");
        dispatch(clearAuth());
      }
    };

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [accessToken, isAuthenticated, isTokenValid, dispatch]);

  return {
    // Token info
    accessToken,
    decodedToken,
    tokenExpiry,
    isAuthenticated,

    // Validation methods
    isTokenValid,
    getTimeUntilExpiry,
    willExpireSoon,

    // Token management
    refreshToken,
    clearToken,

    // User info from token
    getUserFromJwt,
    hasRole,
  };
}
