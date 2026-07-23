/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff4ed',
          100: '#ffe6d5',
          200: '#ffcaaa',
          300: '#ffa475',
          400: '#ff733b',
          500: '#F74B00', // Primary Accent
          600: '#dd3700',
          700: '#b42700',
          800: '#902107',
          900: '#751f0c',
          950: '#400c03',
        },
        surface: {
          light: '#FFFFFF',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'soft-hover': '0 10px 25px -3px rgba(247, 75, 0, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'brand': '0 8px 20px -4px rgba(247, 75, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
