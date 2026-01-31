export interface User {
  userId: string;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address: string;
  zipCode: string;
  twoFactorEnabled: boolean;
}

// Export resource tracking types
export * from './resourceTracking';

export interface RegisterRequest {
  email: string;
  password: string;
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  address: string;
  zipCode: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  expiresAt?: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  message?: string;
  requiresTwoFactor?: boolean;
}

export interface UpdateProfileRequest {
  title: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  zipCode: string;
}

export interface TwoFactorSetup {
  qrCodeUri: string;
  qrCodeImage: string;
  manualEntryKey: string;
}

export interface TwoFactorVerifyRequest {
  email: string;
  code: string;
}

export interface EnableTwoFactorRequest {
  code: string;
}

export interface ApiError {
  message: string;
  errors?: string[];
}

// Re-export role-related types
export * from "./roles";
export * from "./clients";
export * from "./employees";
