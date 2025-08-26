/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(230, 70%, 50%)',
        accent: 'hsl(170, 80%, 45%)',
        bg: 'hsl(220, 15%, 95%)',
        surface: 'hsl(240, 10%, 100%)',
        text: 'hsl(220, 15%, 20%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '24px',
      },
      boxShadow: {
        'card': '0 4px 16px hsla(220, 15%, 20%, 0.1)',
        'modal': '0 12px 36px hsla(220, 15%, 20%, 0.15)',
      },
      transitionDuration: {
        'fast': '100ms',
        'base': '200ms',
        'slow': '400ms',
      }
    },
  },
  plugins: [],
}