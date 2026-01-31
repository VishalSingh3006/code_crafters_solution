import type { IAuthResponse } from "../types/authResponse";
import { baseServices } from "./baseServices";

class AuthService {
  private baseServices = baseServices;
  async login(email: string, password: string): Promise<IAuthResponse> {
    const response = await this.baseServices.post<IAuthResponse>(
      "api/auth/login",
      {
        email,
        password,
      }
    );
    return response;
  }

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthResponse> {
    const response = await this.baseServices.post<IAuthResponse>(
      "api/auth/signup",
      {
        name,
        email,
        password,
      }
    );
    return response;
  }
}

// Export singleton instance
export const authService = new AuthService();
