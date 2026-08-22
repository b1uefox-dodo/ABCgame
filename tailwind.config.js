/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        bubble: ['"Fredoka"', '"Comic Sans MS"', 'system-ui', 'sans-serif']
      },
      animation: {
        'bounce-soft': 'bounceSoft 1s infinite alternate ease-in-out',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        float: 'float 3s infinite ease-in-out',
        'spin-slow': 'spin 12s linear infinite',
        wiggle: 'wiggle 0.5s ease-in-out infinite',
        'pop-in': 'popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'pop-out': 'popOut 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        rainbow: 'rainbow 6s linear infinite'
      },
      keyframes: {
        bounceSoft: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-12px)' }
        },
        pulseGlow: {
          '0%, 100%': {
            transform: 'scale(1)',
            filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))'
          },
          '50%': { transform: 'scale(1.06)', filter: 'drop-shadow(0 0 25px rgba(255,105,180,0.9))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(3deg)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(4deg)' }
        },
        popIn: {
          '0%': { transform: 'scale(0.3) rotate(-15deg)', opacity: '0' },
          '70%': { transform: 'scale(1.15) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        },
        popOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '40%': { transform: 'scale(1.35)', opacity: '0.9' },
          '100%': { transform: 'scale(0.1)', opacity: '0' }
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' }
        }
      }
    }
  },
  plugins: []
};
