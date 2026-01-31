import { baseServices } from "./baseServices";
import type {
  ITwoFactorSetup,
  ITwoFactorStatus,
  ITwoFactorVerify,
  ITwoFactorEnable,
} from "../types/twoFactor";

class TwoFactorService {
  async getStatus(): Promise<ITwoFactorStatus> {
    const response: {
      success: boolean;
      message: string;
      data: ITwoFactorStatus;
      requiresTwoFactor: null | boolean;
      errors: null | unknown;
    } = await baseServices.get("api/TwoFactor/status");
    return response.data;
  }

  async setup(): Promise<ITwoFactorSetup> {
    const response = await baseServices.post<{
      success: boolean;
      message: string;
      data: ITwoFactorSetup;
      requiresTwoFactor: null | boolean;
      errors: null | unknown;
    }>("api/TwoFactor/setup");
    return response.data;
  }

  async enable(data: ITwoFactorEnable): Promise<{ success: boolean }> {
    const response = await baseServices.post<{ success: boolean }>(
      "api/TwoFactor/verify-setup",
      data
    );
    return response;
  }

  async disable(code: string): Promise<{ success: boolean }> {
    const response = await baseServices.post<{ success: boolean }>(
      "api/TwoFactor/disable",
      { code }
    );
    return response;
  }

  async verify(
    data: ITwoFactorVerify
  ): Promise<{ success: boolean; token?: string }> {
    const response = await baseServices.post<{
      success: boolean;
      token?: string;
    }>("api/TwoFactor/verify-login", data);
    return response;
  }

  async regenerateBackupCodes(): Promise<{ backupCodes: string[] }> {
    const response = await baseServices.post<{ backupCodes: string[] }>(
      "api/TwoFactor/backup-codes/regenerate"
    );
    return response;
  }
}

// Export singleton instance
export const twoFactorService = new TwoFactorService();
