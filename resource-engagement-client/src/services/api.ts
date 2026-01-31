import axios, { AxiosResponse } from 'axios';
import {
  User,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UpdateProfileRequest,
  TwoFactorSetup,
  TwoFactorVerifyRequest,
  EnableTwoFactorRequest,
  ApiError
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/auth';

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Don't redirect on 2FA verification errors - let the component handle it
          const url = error.config?.url;
          if (url && url.includes('/2fa/verify')) {
            return Promise.reject(error);
          }
          
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async register(data: RegisterRequest): Promise<{ message: string; userId: string }> {
    const response: AxiosResponse = await this.api.post('/register', data);
    return response.data;
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse = await this.api.post('/login', data);
    return response.data;
  }

  async logout(): Promise<{ message: string }> {
    const response: AxiosResponse = await this.api.post('/logout');
    return response.data;
  }

  // Profile endpoints
  async getProfile(): Promise<User> {
    const response: AxiosResponse = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{ message: string; profile: User }> {
    const response: AxiosResponse = await this.api.put('/profile', data);
    return response.data;
  }

  // 2FA endpoints
  async get2FASetup(): Promise<TwoFactorSetup> {
    const response: AxiosResponse = await this.api.get('/2fa/setup');
    return response.data;
  }

  async enable2FA(data: EnableTwoFactorRequest): Promise<{ message: string; twoFactorEnabled: boolean }> {
    const response: AxiosResponse = await this.api.post('/2fa/enable', { 
      enable: true, 
      code: data.code 
    });
    return response.data;
  }

  async verify2FA(data: TwoFactorVerifyRequest): Promise<LoginResponse> {
    const response: AxiosResponse = await this.api.post('/2fa/verify', data);
    return response.data;
  }

  async get2FAStatus(): Promise<{ twoFactorEnabled: boolean }> {
    const response: AxiosResponse = await this.api.get('/2fa/status');
    return response.data;
  }

  async disable2FA(data: { code: string }): Promise<{ message: string; twoFactorEnabled: boolean }> {
    const response: AxiosResponse = await this.api.post('/2fa/enable', { 
      enable: false, 
      code: data.code 
    });
    return response.data;
  }

  // Helper methods
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();