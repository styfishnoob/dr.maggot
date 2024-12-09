/** @type {import('tailwindcss').Config} */

export default {
  content: ['./entrypoints/**/*.{html,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

