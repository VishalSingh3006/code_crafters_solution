import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createMuiColorPalette,
  createCSSCustomProperties,
} from "../styles/brandColors";

export type ThemeMode = "light" | "dark";

interface ThemeModeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: "light",
  toggleTheme: () => {},
});

function getSystemPrefersDark(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStoredPreference(): ThemeMode | null {
  try {
    const stored = localStorage.getItem("themeMode");
    if (stored === "light" || stored === "dark") return stored;
    return null;
  } catch {
    return null;
  }
}

function writeStoredPreference(mode: ThemeMode) {
  try {
    localStorage.setItem("themeMode", mode);
  } catch {
    // ignore write errors
  }
}

export const ThemeModeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const stored = readStoredPreference();
  const initialMode: ThemeMode =
    stored ?? (getSystemPrefersDark() ? "dark" : "light");
  const [mode, setMode] = useState<ThemeMode>(initialMode);

  // If there is no explicit stored preference, react to system changes
  useEffect(() => {
    if (stored != null) return; // user has set a preference
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setMode(e.matches ? "dark" : "light");
    };
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
    } else if (typeof mq.addListener === "function") {
      mq.addListener(handler);
    }
    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", handler);
      } else if (typeof mq.removeListener === "function") {
        mq.removeListener(handler as any);
      }
    };
  }, [stored]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      writeStoredPreference(next);
      return next;
    });
  }, []);

  const theme = useMemo(() => {
    const colorPalette = createMuiColorPalette(mode);

    return createTheme({
      palette: colorPalette,
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 600,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 500,
        },
        h6: {
          fontWeight: 500,
        },
        button: {
          fontWeight: 700,
          fontSize: "1.5rem",
          textTransform: "none",
        },
      },
      shape: {
        borderRadius: 0,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              fontWeight: 700,
              fontSize: "1.5rem",
              padding: "8px 16px",
              textTransform: "none",
            },
            contained: {
              borderRadius: 8,
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 0,
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: 0,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "#334155" // dark theme: darker background for contrast
                  : "#fefde8", // light theme: warm tone from primary-100
            }),
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 0,
            },
          },
        },
      },
    });
  }, [mode]);

  // Apply CSS custom properties to document root
  useEffect(() => {
    const cssProps = createCSSCustomProperties(mode);
    const root = document.documentElement;

    Object.entries(cssProps).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [mode]);

  const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
