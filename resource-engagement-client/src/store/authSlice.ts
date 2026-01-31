import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = !!action.payload.token;
      
      // Persist to localStorage
      if (action.payload.token) {
        localStorage.setItem("authToken", action.payload.token);
      }
      if (action.payload.user) {
        localStorage.setItem("user", JSON.stringify(action.payload.user));
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
