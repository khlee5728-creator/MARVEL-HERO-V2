/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['"Comic Neue"', '"Comic Sans MS"', 'sans-serif'],
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
  plugins: [
    function({ addVariant }) {
      // 터치 디바이스에서 hover 효과를 비활성화하기 위한 variant
      addVariant('hover-supported', '@media (hover: hover) and (pointer: fine)')
    }
  ],
}
