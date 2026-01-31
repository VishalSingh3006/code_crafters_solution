import type { Theme } from "@mui/material/styles";

export type ThemeMode = "light" | "dark";

export interface IThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  toggleTheme: () => void;
}
