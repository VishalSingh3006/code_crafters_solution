import { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCredentials, setUser, clearCredentials } from "../store/authSlice";
import { authService } from "../services/authService";
import { baseServices } from "../services/baseService";
import type { IAuthResponse } from "../types/authResponse";

export function useAuthState() {
  const auth = useAppSelector((s) => s.auth);
  return auth;
}

export function useAuthLogin() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<IAuthResponse> => {
      setLoading(true);
      setError(null);
      try {
        const resp = await authService.login(email, password);
        if (resp.requiresTwoFactor) {
          return resp;
        }
        if (resp.token) {
          // Create user object from response fields
          const user = resp.userId
            ? {
                userId: resp.userId,
                email: resp.email || email,
                firstName: resp.firstName || "",
                lastName: resp.lastName || "",
                title: "",
                phoneNumber: "",
                address: "",
                zipCode: "",
                twoFactorEnabled: false,
              }
            : null;

          dispatch(setCredentials({ user, token: resp.token }));

          // If we don't have complete user data from response, fetch profile
          if (!user || !resp.firstName) {
            try {
              const profile = await baseServices.get("auth/profile");
              dispatch(setUser(profile));
            } catch (e) {
              // Profile fetch failure shouldn't block login; surface minimal error
              console.warn("Failed to fetch profile after login", e);
            }
          }
        }
        return resp;
      } catch (e: any) {
        const msg = e?.message ?? "Login failed";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return { login, loading, error };
}

export function useAuthSignup() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = useCallback(
    async (
      name: string,
      email: string,
      password: string,
    ): Promise<IAuthResponse> => {
      setLoading(true);
      setError(null);
      try {
        const resp = await authService.signup(name, email, password);
        if (resp.token) {
          dispatch(setCredentials({ user: null, token: resp.token }));
          try {
            const profile = await baseServices.get("auth/profile");
            dispatch(setUser(profile));
          } catch (e) {
            console.warn("Failed to fetch profile after signup", e);
          }
        }
        return resp;
      } catch (e: any) {
        const msg = e?.message ?? "Signup failed";
        setError(msg);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return { signup, loading, error };
}

export function useAuthLogout() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await baseServices.post("auth/logout");
      dispatch(clearCredentials());
    } catch (e: any) {
      const msg = e?.message ?? "Logout failed";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { logout, loading, error };
}

export function useAuthForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const forgotPassword = useCallback(async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authService.forgotPassword(email);
      setSuccess(
        response.message ||
          "Password reset instructions have been sent to your email.",
      );
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to send password reset email. Please try again.";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetState = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  return { forgotPassword, loading, error, success, resetState };
}
