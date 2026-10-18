import preset from '../shared/tailwind.preset.js';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: ['./index.html', './*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}', '../shared/**/*.{ts,tsx}'],
};
