import type { IUser } from "./user";

export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: IUser;
  };
  requiresTwoFactor: null | boolean;
  errors: null | unknown;
}
