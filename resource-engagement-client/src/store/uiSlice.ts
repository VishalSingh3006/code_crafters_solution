import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  sideNavOpen: boolean;
}

function readInitialSideNavOpen(): boolean {
  try {
    const v = localStorage.getItem("sideNavOpen");
    if (v === "true") return true;
    if (v === "false") return false;
    return true;
  } catch {
    return true;
  }
}

const initialState: UiState = {
  sideNavOpen: readInitialSideNavOpen(),
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSideNavOpen: (state, action: PayloadAction<boolean>) => {
      state.sideNavOpen = action.payload;
      try {
        localStorage.setItem("sideNavOpen", String(action.payload));
      } catch {}
    },
    toggleSideNav: (state) => {
      state.sideNavOpen = !state.sideNavOpen;
      try {
        localStorage.setItem("sideNavOpen", String(state.sideNavOpen));
      } catch {}
    },
  },
});

export const { setSideNavOpen, toggleSideNav } = uiSlice.actions;
export default uiSlice.reducer;
