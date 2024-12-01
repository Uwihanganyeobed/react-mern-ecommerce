/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        'scale-up': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'checkmark': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        'shine': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        fadeInOut: {
          '0%': { opacity: '0', transform: 'translate(-50%, -40%)' },
          '10%': { opacity: '1', transform: 'translate(-50%, -50%)' },
          '80%': { opacity: '1', transform: 'translate(-50%, -50%)' },
          '100%': { opacity: '0', transform: 'translate(-50%, -50%)' },
        },
      },
      animation: {
        'scale-up': 'scale-up 0.5s ease-out forwards',
        'checkmark': 'checkmark 0.8s ease-out forwards',
        'shine': 'shine 1.5s infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delay-1': 'float 3s ease-in-out 0.1s infinite',
        'float-delay-2': 'float 3s ease-in-out 0.2s infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'bounce-delay-1': 'bounce 1s infinite 0.1s',
        'bounce-delay-2': 'bounce 1s infinite 0.2s',
        'bounce-delay-3': 'bounce 1s infinite 0.3s',
        fadeInOut: 'fadeInOut 3s ease-in-out forwards',
      }
    },
  },
  plugins: [],
}

