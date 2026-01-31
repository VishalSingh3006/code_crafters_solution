import { useState, useCallback } from "react";
import { twoFactorService } from "../services/twoFactorService";
import { baseServices } from "../services/baseService";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setCredentials, setUser } from "../store/authSlice";
import type { TwoFactorSetup } from "../types";

export function useTwoFactor() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);

  const fetchSetup = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await twoFactorService.getSetup();
      setSetup(res);
    } catch (e: any) {
      setError(e?.message ?? "Failed to fetch 2FA setup");
    } finally {
      setLoading(false);
    }
  }, []);

  const enable = useCallback(
    async (code: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await twoFactorService.enable(code);
        if (user)
          dispatch(
            setUser({ ...user, twoFactorEnabled: res.twoFactorEnabled }),
          );
      } catch (e: any) {
        setError(e?.message ?? "Failed to enable 2FA");
      } finally {
        setLoading(false);
      }
    },
    [user, dispatch],
  );

  const disable = useCallback(
    async (code: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await twoFactorService.disable(code);
        if (user)
          dispatch(
            setUser({ ...user, twoFactorEnabled: res.twoFactorEnabled }),
          );
      } catch (e: any) {
        setError(e?.message ?? "Failed to disable 2FA");
      } finally {
        setLoading(false);
      }
    },
    [user, dispatch],
  );

  const status = useCallback(async (): Promise<boolean> => {
    try {
      const res = await twoFactorService.getStatus();
      return res.twoFactorEnabled;
    } catch {
      return !!user?.twoFactorEnabled;
    }
  }, [user]);

  return { setup, fetchSetup, enable, disable, status, loading, error };
}

export function useTwoFactorVerification() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(
    async (email: string, code: string, persistToken = true) => {
      setLoading(true);
      setError(null);
      try {
        const res = await twoFactorService.verify({ email, code });
        if (res.token && persistToken) {
          // Persist token in redux and fetch profile
          dispatch(setCredentials({ user: null as any, token: res.token }));
          try {
            const profile = await baseServices.get("auth/profile");
            dispatch(setUser(profile));
          } catch {}
        }
        return res;
      } catch (e: any) {
        const msg =
          e?.response?.data?.message || e?.message || "Verification failed";
        setError(msg);
        throw new Error(msg);
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return { verify, loading, error };
}
