import { createTheme } from "@mui/material/styles";

const baseTheme = {
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "light" as const,
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: "dark" as const,
    primary: { main: "#90caf9" },
    secondary: { main: "#ce93d8" },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
});

// Default export for backward compatibility
export const theme = lightTheme;
