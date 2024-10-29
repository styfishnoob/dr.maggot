import forms from '@tailwindcss/forms';
import preline from 'preline/plugin';

export default {
  content: ['./entrypoints/**/*.{html,ts,tsx}', 'node_modules/preline/dist/*.js',],
  plugins: [forms, preline],
};