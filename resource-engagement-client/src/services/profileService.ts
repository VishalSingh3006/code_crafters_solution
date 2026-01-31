import { baseServices } from "./baseService";
import type { User, UpdateProfileRequest, TwoFactorSetup } from "../types";

class ProfileService {
  async getProfile(): Promise<User> {
    return await baseServices.get("/profile");
  }

  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<{ message?: string; profile?: User }> {
    return await baseServices.put<{ message?: string; profile?: User }>(
      "/profile",
      data,
    );
  }

  async getTwoFactorSetup(): Promise<TwoFactorSetup> {
    return await baseServices.get("/2fa/setup");
  }

  async getTwoFactorStatus(): Promise<{ twoFactorEnabled: boolean }> {
    return await baseServices.get("/2fa/status");
  }

  async enableTwoFactor(
    code: string,
  ): Promise<{ message?: string; twoFactorEnabled: boolean }> {
    return await baseServices.post<{
      message?: string;
      twoFactorEnabled: boolean;
    }>("/2fa/enable", { enable: true, code });
  }

  async disableTwoFactor(
    code: string,
  ): Promise<{ message?: string; twoFactorEnabled: boolean }> {
    return await baseServices.post<{
      message?: string;
      twoFactorEnabled: boolean;
    }>("/2fa/enable", { enable: false, code });
  }
}

export const profileService = new ProfileService();
