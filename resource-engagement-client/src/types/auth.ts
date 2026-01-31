import type { IJwtPayload } from "./index";

export interface IAuthState {
  user: IUser | null;
  accessToken: string | null;
  decodedToken: IJwtPayload | null;
  loading: boolean;
  isAuthenticated: boolean;
  tokenExpiry: Date | null;
}

export interface IUser {
  id: string;
  email: string;
  name?: string;
  twoFactorEnabled: boolean;
}
