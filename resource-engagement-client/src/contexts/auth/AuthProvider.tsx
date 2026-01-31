import { createContext, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { logout as logoutAction } from "../../store/auth/authSlice";
import {
  loginAsync,
  signupAsync,
  verifyTwoFactorAsync,
  selectUser,
  selectAuthLoading,
} from "../../store/auth/authThunks";
import type { IUser } from "../../types/auth";

type AuthContextValue = {
  user: IUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{
    requiresTwoFactor?: boolean;
    email?: string;
    message?: string;
  }>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  verifyTwoFactor: (code: string, email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Export context for use in hooks
export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await dispatch(loginAsync({ email, password })).unwrap();
      // If result contains requiresTwoFactor, return it for the UI to handle
      if (
        result &&
        typeof result === "object" &&
        "requiresTwoFactor" in result
      ) {
        return result;
      }
      return {};
    },
    [dispatch]
  );

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      await dispatch(signupAsync({ name, email, password })).unwrap();
    },
    [dispatch]
  );

  const verifyTwoFactor = useCallback(
    async (code: string, email: string) => {
      await dispatch(verifyTwoFactorAsync({ code, email })).unwrap();
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutAction());
  }, [dispatch]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, signup, verifyTwoFactor, logout }),
    [user, loading, login, signup, verifyTwoFactor, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
