/** @type {import('tailwindcss').Config} */
export default {
  content: ['./entrypoints/**/*.{html,ts,tsx}', 'node_modules/preline/dist/*.js',],
  plugins: [require('@tailwindcss/forms'), require('preline/plugin')],
}

