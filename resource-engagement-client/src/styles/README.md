# Brand Color System

This directory contains a comprehensive brand color system that integrates Tailwind CSS with Material-UI components, allowing you to change the entire app's brand colors in one place.

## Files Overview

### `brandColors.ts`

The central configuration file that defines:

- Primary, secondary, and accent color scales (50-950)
- Light and dark theme color mappings
- Status colors (success, error, warning, info)
- Material-UI theme integration functions
- CSS custom properties generation

### `brandUtils.ts`

Utility functions and hooks for using brand colors:

- `useBrandColors()` - React hook for accessing theme colors
- `getBrandColor()` - Get specific color shades
- `brandStyles` - Pre-defined component styles
- `brandShadows` - Brand-consistent shadow utilities
- `brandCombinations` - Predefined color combinations

### `brandTheme.css`

CSS classes using CSS custom properties:

- Background, text, and border utilities
- Interactive states (hover, focus)
- Status indicators
- Component-specific styles

## How to Change Brand Colors

### 1. Update Primary Colors

Edit the `primaryColors` object in `brandColors.ts`:

```typescript
export const primaryColors = {
  50: "#eff6ff", // Very light
  100: "#dbeafe", // Light
  200: "#bfdbfe", // ...
  // ... continue through all shades
  500: "#3b82f6", // Main brand color - CHANGE THIS
  600: "#2563eb", // Darker
  // ... through to 950
} as const;
```

### 2. Update Secondary Colors

Similarly, modify the `secondaryColors` object for neutral/secondary elements.

### 3. Update Accent Colors

Modify the `accentColors` object for success states and positive actions.

## Usage Examples

### In React Components with MUI

```tsx
import { useBrandColors } from "../styles/brandUtils";

function MyComponent() {
  const colors = useBrandColors();

  return (
    <Button
      sx={{
        backgroundColor: colors.primary.main,
        "&:hover": { backgroundColor: colors.primary.dark },
      }}
    >
      Branded Button
    </Button>
  );
}
```

### With Tailwind CSS Classes

```tsx
// Using predefined Tailwind colors from config
<div className="bg-primary-500 text-white">
  Primary colored background
</div>

// Using brand CSS utilities
<div className="bg-brand-primary text-brand-secondary">
  Brand colors via CSS custom properties
</div>
```

### Direct Color Access

```tsx
import { getBrandColor, primaryColors } from "../styles/brandColors";

// Get specific shade
const primaryMain = getBrandColor("primary", 500);

// Direct access to color scale
const lightPrimary = primaryColors[100];
```

### CSS Custom Properties

```css
.my-custom-component {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-divider);
}
```

## Color Scale Reference

Each color scale includes these shades:

- `50` - Very light (backgrounds, surfaces)
- `100-200` - Light (hover states, secondary surfaces)
- `300-400` - Medium light (disabled states, borders)
- `500` - **Main color** (primary brand color)
- `600-700` - Medium dark (hover states, active states)
- `800-900` - Dark (text on light backgrounds)
- `950` - Very dark (high contrast text)

## Theme Integration

The system automatically:

- ✅ Updates Material-UI theme colors
- ✅ Sets CSS custom properties for runtime access
- ✅ Provides Tailwind utility classes
- ✅ Handles light/dark theme switching
- ✅ Ensures consistent typography and spacing

## Best Practices

### 1. Use Semantic Color Names

```tsx
// ✅ Good - semantic meaning
<Alert severity="success">Success message</Alert>

// ❌ Avoid - hardcoded colors
<div style={{ color: '#22c55e' }}>Success text</div>
```

### 2. Leverage the Hook System

```tsx
// ✅ Good - uses theme context
const colors = useBrandColors();

// ❌ Avoid - bypasses theme system
import { primaryColors } from "../styles/brandColors";
```

### 3. Use Appropriate Color Scales

```tsx
// ✅ Good - uses scale appropriately
<Button sx={{ backgroundColor: colors.primary.main }}>   // 500
<div style={{ backgroundColor: colors.primary.light }}> // 300

// ❌ Avoid - inconsistent contrast
<Button sx={{ backgroundColor: primaryColors[50] }}>    // Too light
```

### 4. Test Both Themes

Always test your components in both light and dark themes to ensure proper contrast and readability.

## Migration Guide

### From Hardcoded Colors

```tsx
// Before
<Button sx={{ backgroundColor: '#3b82f6' }}>

// After
<Button sx={{ backgroundColor: 'primary.main' }}>
```

### From Theme Palette

```tsx
// Before
const theme = useTheme();
<div style={{ color: theme.palette.primary.main }}>

// After
const colors = useBrandColors();
<div style={{ color: colors.primary.main }}>
```

## Customization Examples

### Corporate Blue Theme

```typescript
export const primaryColors = {
  500: "#0066cc", // Corporate blue
  // Generate other shades around this color
};
```

### Green Tech Theme

```typescript
export const primaryColors = {
  500: "#10b981", // Emerald green
};

export const accentColors = {
  500: "#3b82f6", // Blue accent
};
```

### Monochrome Professional

```typescript
export const primaryColors = {
  500: "#374151", // Dark gray
};

export const secondaryColors = {
  500: "#6b7280", // Medium gray
};
```

## Development Workflow

1. **Design Phase**: Choose your primary brand color (500 shade)
2. **Generate Scale**: Use a tool like [Tailwind Color Generator](https://uicolors.app) to create the full scale
3. **Update Config**: Replace the color values in `brandColors.ts`
4. **Test**: Run the app and verify all components look correct
5. **Adjust**: Fine-tune individual shades if needed

The system will automatically update all Material-UI components, Tailwind utilities, and CSS custom properties!
