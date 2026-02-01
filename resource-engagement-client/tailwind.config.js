/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Primary Colors - Blue spectrum for professional/tech feel
        primary: {
          50: '#eff6ff',   // Very light blue
          100: '#dbeafe',  // Light blue
          200: '#bfdbfe',  // Lighter blue
          300: '#93c5fd',  // Medium light blue
          400: '#60a5fa',  // Medium blue
          500: '#3b82f6',  // Base primary (main brand color)
          600: '#2563eb',  // Darker blue
          700: '#1d4ed8',  // Dark blue
          800: '#1e40af',  // Very dark blue
          900: '#1e3a8a',  // Darkest blue
          950: '#172554',  // Ultra dark blue
        },

        // Brand Secondary Colors - Purple/Indigo for accent
        secondary: {
          50: '#f8fafc',   // Very light gray-blue
          100: '#f1f5f9',  // Light gray-blue
          200: '#e2e8f0',  // Lighter gray-blue
          300: '#cbd5e1',  // Medium light gray-blue
          400: '#94a3b8',  // Medium gray-blue
          500: '#64748b',  // Base secondary
          600: '#475569',  // Darker gray-blue
          700: '#334155',  // Dark gray-blue
          800: '#1e293b',  // Very dark gray-blue
          900: '#0f172a',  // Darkest gray-blue
          950: '#020617',  // Ultra dark gray-blue
        },

        // Accent Colors - Green for success/positive actions
        accent: {
          50: '#f0fdf4',   // Very light green
          100: '#dcfce7',  // Light green
          200: '#bbf7d0',  // Lighter green
          300: '#86efac',  // Medium light green
          400: '#4ade80',  // Medium green
          500: '#22c55e',  // Base accent
          600: '#16a34a',  // Darker green
          700: '#15803d',  // Dark green
          800: '#166534',  // Very dark green
          900: '#14532d',  // Darkest green
          950: '#052e16',  // Ultra dark green
        },

        // Status Colors
        status: {
          enabled: '#16a34a',   // green-600
          disabled: '#dc2626',  // red-600
          warning: '#f59e0b',   // amber-500
          info: '#3b82f6',      // blue-500
        },

        // Theme-specific colors
        light: {
          background: {
            primary: '#ffffff',     // Pure white
            secondary: '#f8fafc',   // Very light gray
            tertiary: '#f1f5f9',    // Light gray
          },
          text: {
            primary: '#0f172a',     // Very dark
            secondary: '#475569',   // Medium dark
            tertiary: '#64748b',    // Medium gray
          },
          border: {
            primary: '#e2e8f0',     // Light border
            secondary: '#cbd5e1',   // Medium light border
          }
        },

        dark: {
          background: {
            primary: '#0f172a',     // Very dark blue-gray
            secondary: '#1e293b',   // Dark blue-gray
            tertiary: '#334155',    // Medium dark blue-gray
          },
          text: {
            primary: '#f8fafc',     // Very light
            secondary: '#e2e8f0',   // Light gray
            tertiary: '#cbd5e1',    // Medium light gray
          },
          border: {
            primary: '#475569',     // Dark border
            secondary: '#334155',   // Medium dark border
          }
        }
      },

      // Extend spacing for consistent design system
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // Custom box shadows for depth
      boxShadow: {
        'brand': '0 4px 6px -1px rgba(59, 130, 246, 0.1), 0 2px 4px -1px rgba(59, 130, 246, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
      },

      // Custom border radius - disabled for flat design
      borderRadius: {
        'brand': '0',
      },

      // Typography scale
      fontSize: {
        'brand-xs': ['0.75rem', { lineHeight: '1rem' }],
        'brand-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'brand-base': ['1rem', { lineHeight: '1.5rem' }],
        'brand-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'brand-xl': ['1.25rem', { lineHeight: '1.75rem' }],
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
