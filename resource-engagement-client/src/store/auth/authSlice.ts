import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAuthState, IUser } from "../../types/auth";
import {
  decodeJwtToken,
  getTokenExpirationDate,
  isValidToken,
} from "../../utils/jwt";

// Session storage helpers
const SESSION_KEY = "auth_state";

const loadFromSession = (): Partial<IAuthState> => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      // If we have a token, validate it before restoring state
      if (parsed.accessToken && !isValidToken(parsed.accessToken)) {
        console.warn("Stored token is invalid or expired, clearing auth state");
        sessionStorage.removeItem(SESSION_KEY);
        return {};
      }

      // Convert tokenExpiry back to Date object if it exists
      if (parsed.tokenExpiry) {
        parsed.tokenExpiry = new Date(parsed.tokenExpiry);
      }

      return parsed;
    }
  } catch (error) {
    console.warn("Failed to load auth state from session storage:", error);
  }
  return {};
};

const saveToSession = (state: IAuthState) => {
  try {
    const { user, accessToken, decodedToken, isAuthenticated, tokenExpiry } =
      state;
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        user,
        accessToken,
        decodedToken,
        isAuthenticated,
        tokenExpiry: tokenExpiry?.toISOString(), // Convert Date to string for storage
      })
    );
  } catch (error) {
    console.warn("Failed to save auth state to session storage:", error);
  }
};

const initialState: IAuthState = {
  user: null,
  accessToken: null,
  decodedToken: null,
  loading: false,
  isAuthenticated: false,
  tokenExpiry: null,
  ...loadFromSession(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: IUser; accessToken: string }>
    ) => {
      const { user, accessToken } = action.payload;
      const decodedToken = decodeJwtToken(accessToken);
      const tokenExpiry = getTokenExpirationDate(accessToken);

      state.user = user;
      state.accessToken = accessToken;
      state.decodedToken = decodedToken;
      state.tokenExpiry = tokenExpiry;
      state.isAuthenticated = true;
      state.loading = false;
      saveToSession(state);
    },
    setToken: (state, action: PayloadAction<string>) => {
      const accessToken = action.payload;
      const decodedToken = decodeJwtToken(accessToken);
      const tokenExpiry = getTokenExpirationDate(accessToken);

      state.accessToken = accessToken;
      state.decodedToken = decodedToken;
      state.tokenExpiry = tokenExpiry;
      state.isAuthenticated = !!decodedToken;

      // If we have a decoded token, extract user info from it
      if (decodedToken && decodedToken.sub && decodedToken.email) {
        state.user = {
          id: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.name,
          twoFactorEnabled: false, // Default to false, will be updated from API calls
        };
      }

      saveToSession(state);
    },
    loginFailure: (state) => {
      state.user = null;
      state.accessToken = null;
      state.decodedToken = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
      state.loading = false;
      saveToSession(state);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.decodedToken = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
      state.loading = false;
      saveToSession(state);
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.decodedToken = null;
      state.tokenExpiry = null;
      state.isAuthenticated = false;
      state.loading = false;
      sessionStorage.removeItem(SESSION_KEY);
    },
    updateUserTwoFactor: (state, action: PayloadAction<boolean>) => {
      console.log("updateUserTwoFactor called with:", action.payload);
      console.log("Current user state:", state.user);
      if (state.user) {
        state.user.twoFactorEnabled = action.payload;
        console.log("Updated user state:", state.user);
        saveToSession(state);
      }
    },
  },
});

export const {
  setLoading,
  loginSuccess,
  loginFailure,
  logout,
  clearAuth,
  setToken,
  updateUserTwoFactor,
} = authSlice.actions;
export default authSlice.reducer;
