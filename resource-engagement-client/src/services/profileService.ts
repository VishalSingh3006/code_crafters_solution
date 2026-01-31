import { baseServices } from "./baseService";
import type { User, UpdateProfileRequest, TwoFactorSetup } from "../types";

class ProfileService {
  async getProfile(): Promise<User> {
    return await baseServices.get("/auth/profile");
  }

  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<{ message?: string; profile?: User }> {
    return await baseServices.put<{ message?: string; profile?: User }>(
      "/auth/profile",
      data,
    );
  }

  async getTwoFactorSetup(): Promise<TwoFactorSetup> {
    return await baseServices.get("/auth/2fa/setup");
  }

  async getTwoFactorStatus(): Promise<{ twoFactorEnabled: boolean }> {
    return await baseServices.get("/auth/2fa/status");
  }

  async enableTwoFactor(
    code: string,
  ): Promise<{ message?: string; twoFactorEnabled: boolean }> {
    return await baseServices.post<{
      message?: string;
      twoFactorEnabled: boolean;
    }>("/auth/2fa/enable", { enable: true, code });
  }

  async disableTwoFactor(
    code: string,
  ): Promise<{ message?: string; twoFactorEnabled: boolean }> {
    return await baseServices.post<{
      message?: string;
      twoFactorEnabled: boolean;
    }>("/auth/2fa/enable", { enable: false, code });
  }
}

export const profileService = new ProfileService();
