# Design System & Colors

This project includes a comprehensive design system with custom brand colors, SCSS utilities, and TypeScript support.

## 🎨 Color Palette

### Brand Colors

- **Primary**: #0ea5e9 (Sky Blue) - Main brand color
- **Secondary**: #78716c (Warm Gray) - Supporting color
- **Accent**: #eab308 (Amber) - Highlight color

### Status Colors

- **Success**: #22c55e (Green)
- **Warning**: #f59e0b (Orange)
- **Error**: #ef4444 (Red)
- **Info**: #0ea5e9 (Blue)

### Neutral Colors

- **50-950 scale**: From near white (#fafafa) to near black (#0a0a0a)

## 🛠 Usage

### 1. Tailwind Classes

Use the extended Tailwind classes with your brand colors:

```jsx
// Backgrounds
<div className="bg-brand-primary-500">Primary background</div>
<div className="bg-status-success-100">Light success background</div>

// Text colors
<span className="text-brand-accent-600">Accent text</span>
<span className="text-status-error-500">Error text</span>

// Gradients
<div className="bg-gradient-to-r from-brand-primary-500 to-brand-accent-500">
  Gradient background
</div>
```

### 2. TypeScript/JavaScript

Import and use color values in your components:

```tsx
import { getBrandColor, getStatusColor, brandColors } from "@/styles/colors";

// Get specific color values
const primaryColor = getBrandColor(500); // #0ea5e9
const successColor = getStatusColor("success", 600); // #16a34a

// Use in inline styles
<div style={{ backgroundColor: brandColors.primary[500] }}>
  Brand colored div
</div>;
```

### 3. SCSS Utilities

Use the custom SCSS classes and mixins:

```jsx
// Custom buttons
<button className="btn-brand">Brand Button</button>
<button className="btn-outline">Outline Button</button>

// Status badges
<span className="badge success">Success</span>
<span className="badge error">Error</span>

// Card styles
<div className="card-elevated">Elevated card with shadow</div>
<div className="card-glass">Glass morphism card</div>

// Text effects
<h1 className="text-gradient">Gradient text</h1>

// Animations
<div className="animate-fade-in">Fade in animation</div>
<div className="animate-slide-up">Slide up animation</div>
```

### 4. SCSS Mixins

Use mixins in your custom SCSS:

```scss
.my-component {
  @include flex-center; // Centers content with flexbox
  @include card-shadow; // Adds card shadow with hover effect
  @include brand-gradient; // Applies brand gradient background
}

// Responsive design
.responsive-component {
  padding: 1rem;

  @include respond-to(md) {
    padding: 2rem;
  }

  @include respond-to(lg) {
    padding: 3rem;
  }
}
```

### 5. CSS Variables

Access colors via CSS custom properties:

```css
.custom-element {
  background-color: var(--color-brand-primary);
  color: var(--color-neutral-900);
  box-shadow: var(--shadow-brand);
  transition: all var(--transition-normal);
}
```

## 📁 File Structure

```
src/
├── styles/
│   ├── globals.scss     # Main SCSS file with utilities, mixins, variables
│   └── colors.ts        # TypeScript color definitions and utilities
├── components/
│   └── ui/
│       └── ColorShowcase.tsx  # Demo component showing all colors
└── index.css           # Main CSS file (imports globals.scss)
```

## 🎯 Available Utilities

### Layout

- `.flex-center`, `.flex-between`, `.flex-start`
- `.container-fluid` - Responsive container
- `.stack` - Vertical stack with gap variants

### Effects

- `.brand-gradient` - Brand gradient background
- `.glass` - Glass morphism effect
- `.text-gradient` - Gradient text
- `.animate-fade-in`, `.animate-slide-up`, `.animate-pulse`

### Form Elements

- `.form-group`, `.form-label`, `.form-input`
- Focus states and error styles included

### Cards & Buttons

- `.card-elevated`, `.card-glass`
- `.btn-brand`, `.btn-outline`

### Status Elements

- `.badge` with variants: `.success`, `.warning`, `.error`, `.info`

## 🔧 Customization

### Adding New Colors

1. Update `tailwind.config.js` to add new color scales
2. Update `colors.ts` to export the new colors
3. Update `globals.scss` to add CSS variables

### Creating Custom Components

1. Use the mixins and variables from `globals.scss`
2. Follow the established color and spacing scales
3. Use TypeScript color utilities for consistency

## 📱 Responsive Design

All utilities include responsive breakpoints matching Tailwind:

- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+
- `2xl`: 1536px+

## 🎨 Color Accessibility

All color combinations meet WCAG AA contrast requirements. Use the provided color scales to maintain accessibility across your application.

## 🚀 Getting Started

1. Import colors: `import { brandColors } from '@/styles/colors'`
2. Use Tailwind classes: `className="bg-brand-primary-500"`
3. Apply SCSS utilities: `className="btn-brand card-elevated"`
4. Check the ColorShowcase component for examples
