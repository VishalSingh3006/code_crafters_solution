import { createContext, useMemo } from "react";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import type { IUser, IApiError } from "../types/index";
import { useAppDispatch, type RootState } from "../store/store";
import {
  setLoading,
  loginSuccess,
  loginFailure,
  clearAuth,
} from "../store/auth/authSlice";
import { authService } from "../services/authService";
import { isValidToken } from "../utils/jwt";

type AuthContextValue = {
  user: IUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Export context for use in hooks
export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, loading, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  async function login(email: string, password: string) {
    dispatch(setLoading(true));
    try {
      const {data: { token, user }} = await authService.login(email, password);

      // Validate token before storing
      if (!isValidToken(token)) {
        throw new Error("Received invalid token from server");
      }

      dispatch(loginSuccess({ accessToken: token, user }));
    } catch (e) {
      const error = e as IApiError;
      dispatch(loginFailure());
      throw error;
    }
  }

  async function signup(name: string, email: string, password: string) {
    dispatch(setLoading(true));
    try {
      const {data: { token, user }} = await authService.signup(
        name,
        email,
        password
      );

      // Validate token before storing
      if (!isValidToken(token)) {
        throw new Error("Received invalid token from server");
      }

      dispatch(loginSuccess({ accessToken: token, user }));
    } catch (e) {
      const error = e as IApiError;
      dispatch(loginFailure());
      throw error;
    }
  }

  function logout() {
    dispatch(clearAuth());
  }

  // Auto-logout if token becomes invalid
  if (accessToken && !isValidToken(accessToken) && isAuthenticated) {
    dispatch(clearAuth());
  }

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, isAuthenticated, login, signup, logout }),
    [user, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
