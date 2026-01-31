import { createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { twoFactorService } from "../../services/twoFactorService";
import { setLoading, loginSuccess, loginFailure } from "./authSlice";
import type { RootState } from "../store";

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login(email, password);
      console.log("Login response:", response);

      if (!response) {
        dispatch(loginFailure());
        return rejectWithValue("No response from server");
      }

      // Check if 2FA is required first (this is a valid response even with null data)
      if (response.requiresTwoFactor) {
        dispatch(setLoading(false));
        return {
          requiresTwoFactor: true,
          email,
          message: response.message,
        };
      }

      // Check if login was successful with user data
      if (response.success && response.data?.user && response.data?.token) {
        dispatch(
          loginSuccess({
            user: response.data.user,
            accessToken: response.data.token,
          }),
        );
        return response;
      }

      // Login failed
      dispatch(loginFailure());
      return rejectWithValue(response.message || "Login failed");
    } catch (error) {
      console.error("Login error:", error);
      dispatch(loginFailure());
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed",
      );
    }
  },
);

export const verifyTwoFactorAsync = createAsyncThunk(
  "auth/verifyTwoFactor",
  async (
    { code, email }: { code: string; email: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      dispatch(setLoading(true));
      const result = await twoFactorService.verify({
        code,
        email,
      });
      console.log("2FA verify response:", result);

      // Type the result as the actual API response structure
      const apiResponse = result as {
        success: boolean;
        message?: string;
        data?: {
          token: string;
          user: {
            id: string;
            email: string;
            name?: string;
            twoFactorEnabled: boolean;
          };
        };
        token?: string;
      };

      // Handle the actual API response structure: { success, message, data: { token, user } }
      if (
        apiResponse.success &&
        apiResponse.data?.token &&
        apiResponse.data?.user
      ) {
        dispatch(
          loginSuccess({
            user: apiResponse.data.user,
            accessToken: apiResponse.data.token,
          }),
        );
        return result;
      }
      // Handle direct token response structure (fallback)
      else if (apiResponse.success && apiResponse.token) {
        // For direct token response, we need user data from elsewhere
        console.warn("Received token-only response, user data may be missing");
        return result;
      }

      dispatch(loginFailure());
      return rejectWithValue(
        apiResponse.message || "Invalid verification code",
      );
    } catch (error) {
      console.error("2FA verification error:", error);
      dispatch(loginFailure());
      return rejectWithValue(
        error instanceof Error ? error.message : "2FA verification failed",
      );
    }
  },
);

export const signupAsync = createAsyncThunk(
  "auth/signup",
  async (
    {
      name,
      email,
      password,
    }: { name: string; email: string; password: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.signup(name, email, password);
      console.log("Signup response:", response);

      // Check if response and data exist
      if (!response || !response.data) {
        console.error("Invalid response structure:", response);
        dispatch(loginFailure());
        return rejectWithValue("Invalid response from server");
      }

      // Extract the user and token from the response.data
      dispatch(
        loginSuccess({
          user: response.data.user,
          accessToken: response.data.token,
        }),
      );
      return response;
    } catch (error) {
      console.error("Signup error:", error);
      dispatch(loginFailure());
      return rejectWithValue(
        error instanceof Error ? error.message : "Signup failed",
      );
    }
  },
);

// Selector functions
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectDecodedToken = (state: RootState) => state.auth.decodedToken;
export const selectRoles = (state: RootState) =>
  state.auth.decodedToken?.roles ?? [];
