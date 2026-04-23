/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: '#C41E3A',
        'crimson-dark': '#8B0000',
        'crimson-light': '#E63950',
        gold: '#D4AF37',
        'gold-light': '#F0D060',
        'bg-deep': '#06060F',
        'bg-dark': '#0B0B1F',
        'bg-card': '#0F0F24',
        royal: '#003087',
      },
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}