import { useState, useCallback } from "react";
import { twoFactorService } from "../services/twoFactorService";
import { apiService } from "../services/baseService";
import { useAuth } from "../context/AuthContext";
import type { TwoFactorSetup } from "../types";

export function useTwoFactor() {
  const { user, updateUser } = useAuth();
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
        if (user) {
          updateUser({ ...user, twoFactorEnabled: res.twoFactorEnabled });
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to enable 2FA");
      } finally {
        setLoading(false);
      }
    },
    [user, updateUser],
  );

  const disable = useCallback(
    async (code: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await twoFactorService.disable(code);
        if (user) {
          updateUser({ ...user, twoFactorEnabled: res.twoFactorEnabled });
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to disable 2FA");
      } finally {
        setLoading(false);
      }
    },
    [user, updateUser],
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
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(
    async (email: string, code: string, persistToken = true) => {
      setLoading(true);
      setError(null);
      try {
        const res = await twoFactorService.verify({ email, code });
        if (res.token && persistToken) {
          apiService.setAuthToken(res.token);
          await refreshProfile();
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
    [refreshProfile],
  );

  return { verify, loading, error };
}
