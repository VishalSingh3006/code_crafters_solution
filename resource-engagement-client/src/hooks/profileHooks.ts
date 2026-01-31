import { useState, useCallback } from "react";
import { profileService } from "../services/profileService";
import type { UpdateProfileRequest, TwoFactorSetup } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser } from "../store/authSlice";

export function useProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
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
          dispatch(setUser(res.profile));
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
    [dispatch],
  );

  const reload = useCallback(async () => {
    try {
      const profile = await profileService.getProfile();
      dispatch(setUser(profile));
    } catch (e: any) {
      // swallow
    }
  }, [dispatch]);

  return { user, update, reload, loading, error, success };
}

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
        const res = await profileService.disableTwoFactor(code);
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
      const res = await profileService.getTwoFactorStatus();
      return res.twoFactorEnabled;
    } catch {
      return !!user?.twoFactorEnabled;
    }
  }, [user]);

  return { setup, fetchSetup, enable, disable, status, loading, error };
}
