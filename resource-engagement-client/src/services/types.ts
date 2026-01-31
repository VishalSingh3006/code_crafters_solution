export type FieldErrors = Record<string, string>;

// Server error payload shape returned by the API
export type ApiErrorResponse = {
  code?: string;
  message?: string;
  fieldErrors?: FieldErrors;
  // Allow additional API-specific fields while keeping strong typing
  [key: string]: unknown;
};

export type ApiError = {
  status: number;
  code?: string;
  message: string;
  fieldErrors?: FieldErrors;
  data?: unknown;
};

// Auth response types
export type User = {
  id: string;
  email: string;
  name?: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};
