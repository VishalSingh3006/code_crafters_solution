import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isTokenExpired } from "../utils/jwt";

type AuthState = {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
};

// Check for existing token on initialization
const getInitialState = (): AuthState => {
  try {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");
    
    if (token && !isTokenExpired(token)) {
      const user = userStr ? JSON.parse(userStr) : null;
      return {
        user,
        token,
        isAuthenticated: true,
      };
    } else {
      // Clear expired/invalid tokens
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return {
        user: null,
        token: null,
        isAuthenticated: false,
      };
    }
  } catch (error) {
    console.error("Error initializing auth state:", error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  }
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>,
    ) => {
      const { user, token } = action.payload;
      
      // Validate token before setting
      if (token && !isTokenExpired(token)) {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        
        // Persist to localStorage
        localStorage.setItem("authToken", token);
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      } else {
        console.warn("Attempted to set expired or invalid token");
        // Clear any existing credentials
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      // Clear from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    },
    setUser: (state, action: PayloadAction<any | null>) => {
      state.user = action.payload;
      
      // Persist user data to localStorage
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
  },
});

export const { setCredentials, clearCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
