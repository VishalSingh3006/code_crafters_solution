/**
 * Brand Colors Configuration
 *
 * This file defines the brand color palette that can be used across
 * both Tailwind CSS and Material-UI components. Change colors here
 * to update the entire app's brand palette in one place.
 */

// Primary Brand Colors - Olive spectrum for natural professional feel
export const primaryColors = {
  50: "#fefef7",
  100: "#fefde8",
  200: "#fefacc",
  300: "#fef3a6",
  400: "#fde980",
  500: "#808000", // Main brand color
  600: "#737300",
  700: "#666600",
  800: "#595900",
  900: "#4d4d00",
  950: "#262600",
} as const;

// Secondary Brand Colors - Gray-blue for neutral elements
export const secondaryColors = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b", // Main secondary color
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
  950: "#020617",
} as const;

// Accent Colors - Green for success/positive actions
export const accentColors = {
  50: "#f0fdf4",
  100: "#dcfce7",
  200: "#bbf7d0",
  300: "#86efac",
  400: "#4ade80",
  500: "#22c55e", // Main accent color
  600: "#16a34a",
  700: "#15803d",
  800: "#166534",
  900: "#14532d",
  950: "#052e16",
} as const;

// Status Colors
export const statusColors = {
  success: accentColors[600],
  error: "#dc2626",
  warning: "#f59e0b",
  info: primaryColors[500],
} as const;

// Theme-specific color configurations
export const lightThemeColors = {
  background: {
    primary: "#ffffff",
    secondary: "#f8fafc",
    tertiary: "#f1f5f9",
    paper: "#ffffff",
  },
  text: {
    primary: "#0f172a",
    secondary: "#475569",
    tertiary: "#64748b",
    disabled: "#94a3b8",
  },
  border: {
    primary: "#e2e8f0",
    secondary: "#cbd5e1",
  },
  divider: "#e2e8f0",
} as const;

export const darkThemeColors = {
  background: {
    primary: "#0f172a",
    secondary: "#1e293b",
    tertiary: "#334155",
    paper: "#1e293b",
  },
  text: {
    primary: "#f8fafc",
    secondary: "#e2e8f0",
    tertiary: "#cbd5e1",
    disabled: "#64748b",
  },
  border: {
    primary: "#475569",
    secondary: "#334155",
  },
  divider: "#475569",
} as const;

// Material-UI theme color mappings
export const createMuiColorPalette = (mode: "light" | "dark") => {
  const themeColors = mode === "light" ? lightThemeColors : darkThemeColors;

  return {
    mode,
    primary: {
      main: primaryColors[500],
      light: primaryColors[300],
      dark: primaryColors[700],
      contrastText: mode === "light" ? "#ffffff" : "#ffffff",
    },
    secondary: {
      main: secondaryColors[500],
      light: secondaryColors[300],
      dark: secondaryColors[700],
      contrastText: mode === "light" ? "#ffffff" : "#ffffff",
    },
    success: {
      main: accentColors[500],
      light: accentColors[300],
      dark: accentColors[700],
      contrastText: "#ffffff",
    },
    error: {
      main: "#dc2626",
      light: "#f87171",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
      contrastText: "#ffffff",
    },
    info: {
      main: primaryColors[500],
      light: primaryColors[300],
      dark: primaryColors[700],
      contrastText: "#ffffff",
    },
    background: {
      default: themeColors.background.primary,
      paper: themeColors.background.paper,
    },
    text: {
      primary: themeColors.text.primary,
      secondary: themeColors.text.secondary,
      disabled: themeColors.text.disabled,
    },
    divider: themeColors.divider,
    grey: secondaryColors,
  };
};

// Helper functions for Tailwind integration
export const getTailwindColor = (
  colorSet: typeof primaryColors,
  shade: keyof typeof primaryColors,
) => {
  return colorSet[shade];
};

// CSS custom properties for runtime theme switching
export const createCSSCustomProperties = (mode: "light" | "dark") => {
  const colors = createMuiColorPalette(mode);

  return {
    "--color-primary": colors.primary.main,
    "--color-primary-light": colors.primary.light,
    "--color-primary-dark": colors.primary.dark,
    "--color-secondary": colors.secondary.main,
    "--color-secondary-light": colors.secondary.light,
    "--color-secondary-dark": colors.secondary.dark,
    "--color-success": colors.success.main,
    "--color-error": colors.error.main,
    "--color-warning": colors.warning.main,
    "--color-info": colors.info.main,
    "--color-background": colors.background.default,
    "--color-paper": colors.background.paper,
    "--color-text-primary": colors.text.primary,
    "--color-text-secondary": colors.text.secondary,
    "--color-divider": colors.divider,
  };
};

// Brand gradients
export const brandGradients = {
  primary: `linear-gradient(135deg, ${primaryColors[500]} 0%, ${primaryColors[600]} 100%)`,
  secondary: `linear-gradient(135deg, ${secondaryColors[500]} 0%, ${secondaryColors[600]} 100%)`,
  accent: `linear-gradient(135deg, ${accentColors[500]} 0%, ${accentColors[600]} 100%)`,
  hero: `linear-gradient(135deg, ${primaryColors[600]} 0%, ${primaryColors[800]} 50%, ${accentColors[600]} 100%)`,
} as const;

export default {
  primaryColors,
  secondaryColors,
  accentColors,
  statusColors,
  lightThemeColors,
  darkThemeColors,
  createMuiColorPalette,
  getTailwindColor,
  createCSSCustomProperties,
  brandGradients,
};
