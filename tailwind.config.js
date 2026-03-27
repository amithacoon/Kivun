/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        amber: { 600: '#D97706', 700: '#B45309' },
        ink: '#0a0a0a',
      },
    },
  },
  plugins: [],
}
