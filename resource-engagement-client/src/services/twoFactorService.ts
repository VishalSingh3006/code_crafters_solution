import { baseServices } from "./baseService";
import type {
  TwoFactorSetup,
  TwoFactorVerifyRequest,
  LoginResponse,
} from "../types";

class TwoFactorService {
  async getSetup(): Promise<TwoFactorSetup> {
    return await baseServices.get("/2fa/setup");
  }

  async getStatus(): Promise<{ twoFactorEnabled: boolean }> {
    return await baseServices.get("/2fa/status");
  }

  async enable(
    code: string,
  ): Promise<{ message?: string; twoFactorEnabled: boolean }> {
    return await baseServices.post<{
      message?: string;
      twoFactorEnabled: boolean;
    }>("/2fa/enable", { enable: true, code });
  }

  async disable(
    code: string,
  ): Promise<{ message?: string; twoFactorEnabled: boolean }> {
    return await baseServices.post<{
      message?: string;
      twoFactorEnabled: boolean;
    }>("/2fa/enable", { enable: false, code });
  }

  async verify(payload: TwoFactorVerifyRequest): Promise<LoginResponse> {
    return await baseServices.post<LoginResponse>("/2fa/verify", payload);
  }
}

export const twoFactorService = new TwoFactorService();
