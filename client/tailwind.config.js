/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': {
          'bg': '#121212',
          'surface': '#1E1E1E',
          'primary': '#BB86FC',
          'secondary': '#03DAC6',
        }
      }
    },
  },
  plugins: [],
} 