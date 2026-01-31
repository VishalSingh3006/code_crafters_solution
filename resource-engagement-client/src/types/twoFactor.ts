export interface ITwoFactorSetup {
  secret: string;
  qrCodeDataUrl: string;
  manualEntryKey: string;
  backupCodes: string[];
}

export interface ITwoFactorSetupResponse {
  success: boolean;
  message: string;
  data: ITwoFactorSetup;
  requiresTwoFactor: null | boolean;
  errors: null | unknown;
}

export interface ITwoFactorStatus {
  isEnabled: boolean;
  backupCodesCount: number;
  lastUsed?: string;
}

export interface ITwoFactorVerify {
  code: string;
  email: string;
}

export interface ITwoFactorEnable {
  code: string;
}
