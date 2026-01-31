import axios, { AxiosError } from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import type { NavigateFunction } from "react-router-dom";
import type { Store } from "@reduxjs/toolkit";

// Interface for API error response
interface ApiErrorResponse {
  message?: string;
  error?: string;
  details?: unknown;
}

let storeRef: Store | null = null;

export const setStoreReference = (store: Store) => {
  storeRef = store;
};
// Store reference will be set by the app when it initializes

const getAuthToken = (): string | null => {
  if (!storeRef) return null;
  return storeRef.getState().auth.accessToken;
};

class BaseServices {
  private instance: AxiosInstance;

  constructor() {
    const baseURL =
      import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

    this.instance = axios.create({
      baseURL,
      withCredentials: true,
      timeout: 15000,
      validateStatus: (status) => status >= 200 && status < 300,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        const token = getAuthToken();
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  private normalizeAxiosError(
    error: AxiosError,
    navigate: NavigateFunction,
  ): void {
    if (error.response) {
      const { status, data } = error.response;
      console.error("API Error Response:", data);
      console.error("Status:", status);
      console.error("Headers:", error.response.headers);

      // Handle different status codes
      switch (status) {
        case 401: {
          // Unauthorized - redirect to login
          console.error("Unauthorized access - redirecting to login");
          navigate("/login", { replace: true });
          throw new Error("Session expired. Please login again.");
        }
        case 403: {
          // Forbidden - user doesn't have permission
          console.error("Access forbidden - insufficient permissions");
          throw new Error("You don't have permission to access this resource.");
        }
        case 404: {
          // Resource not found
          console.error("Resource not found");
          throw new Error("The requested resource was not found.");
        }
        case 422: {
          // Validation error
          console.error("Validation error");
          const message =
            typeof data === "object" && data && "message" in data
              ? (data as ApiErrorResponse).message
              : "Validation failed. Please check your input.";
          throw new Error(message);
        }
        case 429: {
          // Rate limiting
          console.error("Rate limit exceeded");
          throw new Error("Too many requests. Please try again later.");
        }
        case 500: {
          // Internal server error
          console.error("Internal server error");
          throw new Error("Internal server error. Please try again later.");
        }
        case 502:
        case 503:
        case 504: {
          // Server unavailable
          console.error("Service unavailable");
          throw new Error(
            "Service temporarily unavailable. Please try again later.",
          );
        }
        default: {
          // Other HTTP errors
          console.error(`HTTP Error ${status}`);
          const message =
            typeof data === "object" && data && "message" in data
              ? (data as ApiErrorResponse).message
              : `Request failed with status ${status}`;
          throw new Error(message);
        }
      }
    } else if (error.request) {
      // Network error - no response received
      console.error("No response received:", error.request);
      throw new Error(
        "Network error. Please check your internet connection and try again.",
      );
    } else {
      // Something else happened in setting up the request
      console.error("Error", error.message);
      console.error("Config:", error.config);
      throw new Error(`Request setup error: ${error.message}`);
    }
  }

  // Expose axios methods
  async get(url: string, navigate?: NavigateFunction) {
    try {
      const response: AxiosResponse = await this.instance.get(url);
      return response.data;
    } catch (error) {
      if (navigate) {
        this.normalizeAxiosError(error as AxiosError, navigate);
      }
      throw error;
    }
  }
  async post<T>(url: string, data?: unknown, navigate?: NavigateFunction) {
    try {
      const response: AxiosResponse<T> = await this.instance.post<T>(url, data);
      return response.data;
    } catch (error) {
      if (navigate) {
        this.normalizeAxiosError(error as AxiosError, navigate);
      }
      throw error;
    }
  }
  async put<T>(url: string, data?: unknown, navigate?: NavigateFunction) {
    try {
      const response: AxiosResponse<T> = await this.instance.put<T>(url, data);
      return response.data;
    } catch (error) {
      if (navigate) {
        this.normalizeAxiosError(error as AxiosError, navigate);
      }
      throw error;
    }
  }
  async delete<T>(url: string, navigate?: NavigateFunction) {
    try {
      const response: AxiosResponse<T> = await this.instance.delete<T>(url);
      return response.data;
    } catch (error) {
      if (navigate) {
        this.normalizeAxiosError(error as AxiosError, navigate);
      }
      throw error;
    }
  }
}

// Export singleton instance
export const baseServices = new BaseServices();

// Keep the standalone function for backward compatibility
export function normalizeAxiosError(
  error: AxiosError,
  navigate: NavigateFunction,
): void {
  return new BaseServices()["normalizeAxiosError"](error, navigate);
}
