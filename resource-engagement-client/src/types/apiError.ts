import type { IFieldErrors } from "./fieldErrors";

export interface IApiError {
  status: number;
  code?: string;
  message: string;
  fieldErrors?: IFieldErrors;
  data?: unknown;
}
