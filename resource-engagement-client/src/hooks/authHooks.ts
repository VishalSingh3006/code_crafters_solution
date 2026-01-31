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
          dispatch(setCredentials({ user: null, token: resp.token }));
          try {
            const profile = await baseServices.get("/profile");
            dispatch(setUser(profile));
          } catch (e) {
            // Profile fetch failure shouldn't block login; surface minimal error
            console.warn("Failed to fetch profile after login", e);
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
            const profile = await baseServices.get("/profile");
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
      await baseServices.post("/logout");
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
