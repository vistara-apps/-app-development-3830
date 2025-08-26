/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(230, 95%, 95%)',
          100: 'hsl(230, 95%, 90%)',
          200: 'hsl(230, 90%, 80%)',
          300: 'hsl(230, 85%, 70%)',
          400: 'hsl(230, 80%, 60%)',
          500: 'hsl(230, 70%, 50%)',
          600: 'hsl(230, 75%, 45%)',
          700: 'hsl(230, 80%, 40%)',
          800: 'hsl(230, 85%, 30%)',
          900: 'hsl(230, 90%, 20%)',
          950: 'hsl(230, 95%, 15%)',
        },
        accent: {
          50: 'hsl(170, 95%, 95%)',
          100: 'hsl(170, 95%, 90%)',
          200: 'hsl(170, 90%, 80%)',
          300: 'hsl(170, 85%, 70%)',
          400: 'hsl(170, 80%, 55%)',
          500: 'hsl(170, 80%, 45%)',
          600: 'hsl(170, 85%, 40%)',
          700: 'hsl(170, 90%, 35%)',
          800: 'hsl(170, 95%, 25%)',
          900: 'hsl(170, 95%, 20%)',
          950: 'hsl(170, 95%, 15%)',
        },
        bg: 'hsl(220, 15%, 95%)',
        surface: 'hsl(240, 10%, 100%)',
        text: {
          primary: 'hsl(220, 15%, 20%)',
          secondary: 'hsl(220, 10%, 40%)',
          tertiary: 'hsl(220, 5%, 60%)',
        },
        success: {
          50: 'hsl(142, 76%, 95%)',
          100: 'hsl(142, 72%, 90%)',
          500: 'hsl(142, 71%, 45%)',
          600: 'hsl(142, 72%, 35%)',
        },
        warning: {
          50: 'hsl(48, 96%, 95%)',
          100: 'hsl(48, 96%, 90%)',
          500: 'hsl(48, 96%, 53%)',
          600: 'hsl(48, 96%, 43%)',
        },
        error: {
          50: 'hsl(0, 86%, 95%)',
          100: 'hsl(0, 86%, 90%)',
          500: 'hsl(0, 86%, 59%)',
          600: 'hsl(0, 86%, 49%)',
        },
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      boxShadow: {
        'sm': '0 1px 2px hsla(220, 15%, 20%, 0.05)',
        'card': '0 4px 16px hsla(220, 15%, 20%, 0.1)',
        'card-hover': '0 8px 24px hsla(220, 15%, 20%, 0.15)',
        'modal': '0 12px 36px hsla(220, 15%, 20%, 0.15)',
        'focus': '0 0 0 3px hsla(230, 70%, 50%, 0.3)',
      },
      transitionDuration: {
        'fast': '100ms',
        'base': '200ms',
        'slow': '400ms',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'hsl(220, 15%, 20%)',
            lineHeight: '1.5',
          },
        },
      },
    },
  },
  plugins: [],
}
