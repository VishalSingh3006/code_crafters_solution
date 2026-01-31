/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        status: {
          enabled: '#16a34a', // green-600
          disabled: '#dc2626', // red-600
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
};
