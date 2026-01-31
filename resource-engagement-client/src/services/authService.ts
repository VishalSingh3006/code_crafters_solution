import type { IAuthResponse } from "../types/authResponse";
import { baseServices } from "./baseService";
import { mockAuthService } from "./mockAuthService";

class AuthService {
  private base = baseServices;
  private useMock = false; // Set to true to use mock service

  async login(email: string, password: string): Promise<IAuthResponse> {
    if (this.useMock) {
      return mockAuthService.login(email, password);
    }

    try {
      const response = await this.base.post<IAuthResponse>("auth/login", {
        email,
        password,
      });
      return response;
    } catch (error: any) {
      if (error.message?.includes("Backend server is not responding")) {
        console.warn("Falling back to mock auth service");
        this.useMock = true;
        return mockAuthService.login(email, password);
      }
      throw error;
    }
  }

  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<IAuthResponse> {
    if (this.useMock) {
      return mockAuthService.signup(name, email, password);
    }

    try {
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
    } catch (error: any) {
      if (error.message?.includes("Backend server is not responding")) {
        console.warn("Falling back to mock auth service");
        this.useMock = true;
        return mockAuthService.signup(name, email, password);
      }
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
