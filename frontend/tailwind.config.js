/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        slate: {
          150: '#eef1f6',
          505: '#64748b',
          550: '#53637a',
        },
        blue: {
          650: '#2056d6',
        },
        red: {
          150: '#fde2e2',
        },
      },
    },
  },
  plugins: [],
}

