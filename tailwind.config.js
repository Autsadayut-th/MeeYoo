/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          500: '#6366f1',
          600: '#4f46e5',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
