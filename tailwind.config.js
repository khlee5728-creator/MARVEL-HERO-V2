/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Comic Neue"', '"Comic Sans MS"', 'cursive'],
      },
      colors: {
        marvel: {
          red: '#e23636',
          dark: '#1a1a2e',
          gold: '#f4c430',
        },
      },
    },
  },
  plugins: [],
}
