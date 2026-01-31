import { useState, useEffect, createContext } from "react";
import type { ReactNode } from "react";
import { lightTheme, darkTheme } from "../../components/ui/theme";
import type { IThemeContextValue, ThemeMode } from "../../types/theme";

type ThemeProviderProps = {
  children: ReactNode;
};

const ThemeContext = createContext<IThemeContextValue | undefined>(undefined);

export { ThemeContext };

export function CustomThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Get saved theme from localStorage or default to light
    const saved = localStorage.getItem("theme-mode");
    return (saved as ThemeMode) || "light";
  });

  const theme = mode === "light" ? lightTheme : darkTheme;

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  useEffect(() => {
    // Apply theme to document for proper background color
    document.documentElement.style.backgroundColor =
      theme.palette.background.default;
  }, [theme]);

  const value = {
    theme,
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
