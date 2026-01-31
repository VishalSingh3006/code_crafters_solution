import { useState, useCallback } from "react";
import { profileService } from "../services/profileService";
import { useAuth } from "../context/AuthContext";
import type { UpdateProfileRequest, TwoFactorSetup, User } from "../types";

export function useProfile() {
  const { user, updateUser, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const update = useCallback(
    async (data: UpdateProfileRequest) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await profileService.updateProfile(data);
        if (res.profile) {
          updateUser(res.profile);
          setSuccess("Profile updated successfully!");
        } else {
          setSuccess(res.message ?? "Profile updated.");
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to update profile");
      } finally {
        setLoading(false);
      }
    },
    [updateUser],
  );

  const reload = useCallback(async () => {
    try {
      await refreshProfile();
    } catch (e: any) {
      // swallow
    }
  }, [refreshProfile]);

  return { user, update, reload, loading, error, success };
}

export function useTwoFactor() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);

  const fetchSetup = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileService.getTwoFactorSetup();
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
        const res = await profileService.enableTwoFactor(code);
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
        const res = await profileService.disableTwoFactor(code);
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
      const res = await profileService.getTwoFactorStatus();
      return res.twoFactorEnabled;
    } catch {
      return !!user?.twoFactorEnabled;
    }
  }, [user]);

  return { setup, fetchSetup, enable, disable, status, loading, error };
}
