import type { IAuthResponse } from "../types/authResponse";
import { baseServices } from "./baseService";

class AuthService {
  private base = baseServices;

  async login(email: string, password: string): Promise<IAuthResponse> {
    const response = await this.base.post<IAuthResponse>("auth/login", {
      email,
      password,
    });
    return response;
  }

  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<IAuthResponse> {
    // Backend uses `/register`; map signup to register
    const response = await this.base.post<IAuthResponse>("auth/register", {
      // Assuming backend requires at least these fields; extend as needed
      firstName: name,
      lastName: "",
      email,
      password,
      title: "",
      phoneNumber: "",
      address: "",
      zipCode: "",
    });
    return response;
  }

  async forgotPassword(
    email: string,
  ): Promise<{ message: string; requiresTwoFactor?: boolean }> {
    const response = await this.base.post<{
      message: string;
      requiresTwoFactor?: boolean;
    }>("auth/forgot-password", {
      email,
    });
    return response;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const response = await this.base.post<{ message: string }>(
      "auth/change-password",
      {
        currentPassword,
        newPassword,
      },
    );
    return response;
  }
}

// Export singleton instance
export const authService = new AuthService();
