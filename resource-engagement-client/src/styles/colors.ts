// Brand color configuration for use in TypeScript/React components
export const brandColors = {
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Main brand color
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
  secondary: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c", // Secondary brand color
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09",
  },
  accent: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308", // Accent color
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006",
  },
} as const;

export const statusColors = {
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Success green
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
  },
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Warning orange
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03",
  },
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Error red
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a",
  },
  info: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9", // Info blue
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49",
  },
} as const;

export const neutralColors = {
  50: "#fafafa",
  100: "#f5f5f5",
  200: "#e5e5e5",
  300: "#d4d4d4",
  400: "#a3a3a3",
  500: "#737373",
  600: "#525252",
  700: "#404040",
  800: "#262626",
  900: "#171717",
  950: "#0a0a0a",
} as const;

// Main color palette for easy access
export const colors = {
  brand: brandColors,
  status: statusColors,
  neutral: neutralColors,
} as const;

// Color utility functions
export const getBrandColor = (
  shade: keyof typeof brandColors.primary = 500,
) => {
  return brandColors.primary[shade];
};

export const getStatusColor = (
  status: keyof typeof statusColors,
  shade: keyof typeof statusColors.success = 500,
) => {
  return statusColors[status][shade];
};

export const getNeutralColor = (shade: keyof typeof neutralColors = 500) => {
  return neutralColors[shade];
};

// Tailwind class name generators
export const getBrandClass = (
  shade: keyof typeof brandColors.primary = 500,
) => {
  return `bg-brand-primary-${shade}`;
};

export const getTextBrandClass = (
  shade: keyof typeof brandColors.primary = 500,
) => {
  return `text-brand-primary-${shade}`;
};

export const getStatusClass = (
  status: keyof typeof statusColors,
  shade: keyof typeof statusColors.success = 500,
) => {
  return `bg-status-${status}-${shade}`;
};

export const getTextStatusClass = (
  status: keyof typeof statusColors,
  shade: keyof typeof statusColors.success = 500,
) => {
  return `text-status-${status}-${shade}`;
};

// CSS custom properties
export const cssVariables = {
  // Brand colors
  "--color-brand-primary": brandColors.primary[500],
  "--color-brand-primary-dark": brandColors.primary[600],
  "--color-brand-primary-light": brandColors.primary[400],
  "--color-brand-secondary": brandColors.secondary[500],
  "--color-brand-accent": brandColors.accent[500],

  // Status colors
  "--color-success": statusColors.success[500],
  "--color-warning": statusColors.warning[500],
  "--color-error": statusColors.error[500],
  "--color-info": statusColors.info[500],

  // Neutral colors
  "--color-neutral-50": neutralColors[50],
  "--color-neutral-100": neutralColors[100],
  "--color-neutral-500": neutralColors[500],
  "--color-neutral-900": neutralColors[900],
} as const;

// Type definitions for better TypeScript support
export type BrandColorShade = keyof typeof brandColors.primary;
export type StatusColor = keyof typeof statusColors;
export type StatusColorShade = keyof typeof statusColors.success;
export type NeutralColorShade = keyof typeof neutralColors;

export type ColorPalette = {
  brand: typeof brandColors;
  status: typeof statusColors;
  neutral: typeof neutralColors;
};
