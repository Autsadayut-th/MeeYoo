/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffdfa',
          100: '#faf8f5',
          200: '#f2eee8',
          300: '#e5ded4',
        },
        bamboo: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        terracotta: {
          50: '#fffbe6',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'Prompt', 'sans-serif'],
        body: ['Prompt', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
