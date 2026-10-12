/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pcmc-blue': '#245D9C',
        'pcmc-blue-dark': '#1a4778',
        'pcmc-blue-light': '#e9f1fa',
        'pcmc-navy': '#15171D',
        'pcmc-navy-light': '#1e2129',
        'pcmc-gold': '#B79A68',
        'pcmc-gold-dark': '#967b4d',
        'pcmc-gold-light': '#f7f4ed',
        'pcmc-bg': '#F4F6F9',
        'pcmc-text': '#202936',
        'pcmc-muted': '#64748B',
        'pcmc-success': '#218653',
        'pcmc-warning': '#D99A24',
        'pcmc-error': '#C83D43'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    }
  },
  plugins: []
};
