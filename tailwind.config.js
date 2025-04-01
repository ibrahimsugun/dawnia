/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'medieval': ['MedievalSharp', 'cursive'],
      },
      backgroundImage: {
        'parchment': "url('/assets/parchment-bg.jpg')",
      },
    },
  },
  plugins: [],
};
