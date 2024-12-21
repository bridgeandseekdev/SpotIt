/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        //Background colors
        bg: {
          primary: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary: '#F3F4F6',
          'dark-primary': '#242F41',
          'dark-secondary': '#1E293B',
          'dark-tertiary': '#192331',
        },
        // Text colors
        text: {
          primary: '#18181B',
          secondary: '#52525B',
          tertiary: '#71717A',
          'dark-primary': '#F1F3F7',
          'dark-secondary': '#E2E4E9',
          'dark-tertiary': '#CBD0D9',
        },
        // Icon specific colors
        icon: {
          light: {},
          dark: {},
        },

        // Icon specific colors
        cardIcons: {
          light: {
            secondary2: '#E5E4E5',
            tertiary2: '#faf9fa',
          },
          dark: {
            primary: '#A8A6A7',
            secondary: '#E5E4E5',
            tertiary: '#faf9fa',
            primary2: '#696868',
          },
        },
        // Accent/Brand colors
        brand: {
          primary: '#FF6B6B',
          secondary: '#4ECDC4',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
