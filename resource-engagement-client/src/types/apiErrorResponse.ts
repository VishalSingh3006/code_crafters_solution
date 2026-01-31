import type { IFieldErrors } from "./fieldErrors";


// Server error payload shape returned by the API
export interface IApiErrorResponse {
  code?: string;
  message?: string;
  fieldErrors?: IFieldErrors;
  // Allow additional API-specific fields while keeping strong typing
  [key: string]: unknown;
}



// Auth response types


