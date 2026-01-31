import { useContext } from "react";
import { ThemeContext } from "../contexts/theme/CustomThemeProvider";

export function useCustomTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useCustomTheme must be used within CustomThemeProvider");
  }
  return context;
}
