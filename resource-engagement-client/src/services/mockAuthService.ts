import type { IAuthResponse } from "../types/authResponse";

class MockAuthService {
  async login(email: string, password: string): Promise<IAuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple mock validation - accept any email/password for demo
    if (email && password) {
      return {
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          id: 1,
          email: email,
          firstName: "Demo",
          lastName: "User",
          title: "Developer"
        },
        requiresTwoFactor: false
      };
    } else {
      throw new Error("Invalid email or password");
    }
  }

  async signup(
    name: string,
    email: string,
    password: string,
  ): Promise<IAuthResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      token: `mock-jwt-token-${Date.now()}`,
      user: {
        id: 2,
        email: email,
        firstName: name.split(' ')[0] || 'New',
        lastName: name.split(' ')[1] || 'User',
        title: "New User"
      },
      requiresTwoFactor: false
    };
  }
}

export const mockAuthService = new MockAuthService();