/**
 * Brand Theme Utilities
 *
 * Helper functions and hooks for using brand colors in components
 */

import { useTheme } from "@mui/material/styles";
import {
  primaryColors,
  secondaryColors,
  accentColors,
  statusColors,
  brandGradients,
} from "./brandColors";

// Type definitions for brand color scales
export type ColorScale = typeof primaryColors;
export type ColorShade = keyof ColorScale;

// Hook to get brand colors with current theme context
export const useBrandColors = () => {
  const theme = useTheme();

  return {
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    success: theme.palette.success,
    error: theme.palette.error,
    warning: theme.palette.warning,
    info: theme.palette.info,
    background: theme.palette.background,
    text: theme.palette.text,
    divider: theme.palette.divider,
    // Raw color scales for direct access
    primaryScale: primaryColors,
    secondaryScale: secondaryColors,
    accentScale: accentColors,
    status: statusColors,
    gradients: brandGradients,
  };
};

// Utility function to get color by shade
export const getBrandColor = (
  scale: "primary" | "secondary" | "accent",
  shade: ColorShade = 500,
): string => {
  const scales = {
    primary: primaryColors,
    secondary: secondaryColors,
    accent: accentColors,
  };

  return scales[scale][shade];
};

// Generate CSS custom property name
export const getCSSVar = (property: string): string => {
  return `var(--color-${property})`;
};

// Create inline styles using brand colors
export const brandStyles = {
  // Primary button style
  primaryButton: {
    background: `linear-gradient(135deg, ${primaryColors[500]} 0%, ${primaryColors[600]} 100%)`,
    color: "#ffffff",
    border: "none",
    borderRadius: 0,
    padding: "8px 16px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: `linear-gradient(135deg, ${primaryColors[600]} 0%, ${primaryColors[700]} 100%)`,
      boxShadow: "0 4px 8px rgba(59, 130, 246, 0.15)",
    },
  },

  // Secondary button style
  secondaryButton: {
    background: "transparent",
    color: primaryColors[600],
    border: `1px solid ${primaryColors[300]}`,
    borderRadius: 0,
    padding: "8px 16px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      background: primaryColors[50],
      borderColor: primaryColors[400],
    },
  },

  // Card with brand styling
  brandCard: {
    background: getCSSVar("paper"),
    border: `1px solid ${getCSSVar("divider")}`,
    borderRadius: 0,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.2s ease",
    "&:hover": {
      boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)",
    },
  },

  // Status indicators
  statusSuccess: {
    color: statusColors.success,
    backgroundColor: `${accentColors[100]}`,
    padding: "4px 8px",
    borderRadius: 0,
    fontSize: "0.875rem",
    fontWeight: 500,
  },

  statusError: {
    color: statusColors.error,
    backgroundColor: "#fee2e2",
    padding: "4px 8px",
    borderRadius: 0,
    fontSize: "0.875rem",
    fontWeight: 500,
  },

  statusWarning: {
    color: statusColors.warning,
    backgroundColor: "#fef3c7",
    padding: "4px 8px",
    borderRadius: 0,
    fontSize: "0.875rem",
    fontWeight: 500,
  },

  statusInfo: {
    color: statusColors.info,
    backgroundColor: primaryColors[100],
    padding: "4px 8px",
    borderRadius: 0,
    fontSize: "0.875rem",
    fontWeight: 500,
  },
};

// Create theme-aware color function
export const getThemeColor = (
  lightColor: string,
  darkColor: string,
  mode: "light" | "dark",
): string => {
  return mode === "light" ? lightColor : darkColor;
};

// Generate brand-consistent shadows
export const brandShadows = {
  sm: `0 1px 2px 0 ${primaryColors[500]}08`,
  base: `0 1px 3px 0 ${primaryColors[500]}10, 0 1px 2px 0 ${primaryColors[500]}06`,
  md: `0 4px 6px -1px ${primaryColors[500]}10, 0 2px 4px -1px ${primaryColors[500]}06`,
  lg: `0 10px 15px -3px ${primaryColors[500]}10, 0 4px 6px -2px ${primaryColors[500]}05`,
  xl: `0 20px 25px -5px ${primaryColors[500]}10, 0 10px 10px -5px ${primaryColors[500]}04`,
};

// Color contrast utilities
export const getContrastColor = (backgroundColor: string): string => {
  // Simple contrast calculation - in a real app, you might want a more sophisticated method
  const color = backgroundColor.replace("#", "");
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#ffffff";
};

// Predefined brand color combinations
export const brandCombinations = {
  primary: {
    main: primaryColors[500],
    surface: primaryColors[50],
    onSurface: primaryColors[900],
  },
  secondary: {
    main: secondaryColors[500],
    surface: secondaryColors[50],
    onSurface: secondaryColors[900],
  },
  success: {
    main: accentColors[500],
    surface: accentColors[50],
    onSurface: accentColors[900],
  },
  error: {
    main: statusColors.error,
    surface: "#fee2e2",
    onSurface: "#7f1d1d",
  },
  warning: {
    main: statusColors.warning,
    surface: "#fef3c7",
    onSurface: "#78350f",
  },
  info: {
    main: statusColors.info,
    surface: primaryColors[50],
    onSurface: primaryColors[900],
  },
};

export default {
  useBrandColors,
  getBrandColor,
  getCSSVar,
  brandStyles,
  getThemeColor,
  brandShadows,
  getContrastColor,
  brandCombinations,
};
