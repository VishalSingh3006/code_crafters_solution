export interface IFieldErrors {
  [key: string]: string;
}

// Server error payload shape returned by the API
export interface IApiErrorResponse {
  code?: string;
  message?: string;
  fieldErrors?: IFieldErrors;
  // Allow additional API-specific fields while keeping strong typing
  [key: string]: unknown;
}

export interface IApiError {
  status: number;
  code?: string;
  message: string;
  fieldErrors?: IFieldErrors;
  data?: unknown;
}

// Auth response types
export interface IUser {
  id: string;
  email: string;
  name?: string;
}

export interface IAuthResponse {
  accessToken: string;
  user: IUser;
}

// JWT token payload interface
export interface IJwtPayload {
  sub: string; // Subject (user ID)
  email: string;
  name?: string;
  iat: number; // Issued at
  exp: number; // Expiration time
  iss?: string; // Issuer
  aud?: string; // Audience
  roles?: string[]; // User roles/permissions
  [key: string]: unknown; // Allow additional custom claims
}

// Auth state interface
export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  decodedToken: IJwtPayload | null;
  loading: boolean;
  isAuthenticated: boolean;
  tokenExpiry: Date | null;
}

// Re-export everything from index for backward compatibility
export * from "./twoFactor";
export * from "./theme";
