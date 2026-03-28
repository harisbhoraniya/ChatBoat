/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d9ff',
          300: '#a3bcff',
          400: '#7896ff',
          500: '#4f6ef7',
          600: '#3a52e8',
          700: '#2f40cc',
          800: '#2834a5',
          900: '#263082',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8f9fc',
          100: '#f0f2f8',
          200: '#e4e7f0',
          300: '#d1d6e8',
        },
      },
      boxShadow: {
        'chat':   '0 2px 40px rgba(79,110,247,0.08), 0 1px 3px rgba(0,0,0,0.06)',
        'bubble': '0 1px 2px rgba(0,0,0,0.06)',
        'card':   '0 4px 24px rgba(79,110,247,0.1), 0 1px 4px rgba(0,0,0,0.06)',
        'glow':   '0 0 0 3px rgba(79,110,247,0.15)',
      },
      animation: {
        'fade-up':    'fadeUp 0.22s ease forwards',
        'fade-in':    'fadeIn 0.18s ease forwards',
        'slide-left': 'slideLeft 0.22s ease forwards',
        'slide-right':'slideRight 0.22s ease forwards',
        'bounce-dot': 'bounceDot 1.2s infinite',
        'pop':        'pop 0.18s ease forwards',
        'scale-in':   'scaleIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        fadeUp:     { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideLeft:  { from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideRight: { from: { opacity: '0', transform: 'translateX(16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        bounceDot:  { '0%,80%,100%': { transform: 'translateY(0)', opacity: '0.4' }, '40%': { transform: 'translateY(-5px)', opacity: '1' } },
        pop:        { '0%': { transform: 'scale(0.8)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        scaleIn:    { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
