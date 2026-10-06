/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: '#22274F',
        gold: '#C19450',
        cream: '#F7F4EA',
        'light-blue': '#A2CBED',
        'paris-navy': '#22274F',
        'paris-gold': '#C19450',
        'paris-cream': '#F7F4EA',
        'paris-blue': '#A2CBED',
      },
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
