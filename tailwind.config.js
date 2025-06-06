/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'neon-green': '#00ff88',
      },
      maxWidth: {
        'mobile': '414px',
      },
      height: {
        'mobile': '896px',
      },
      padding: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      margin: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        '88': '22rem',
        '92': '23rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px #00ff88' },
          '50%': { boxShadow: '0 0 20px #00ff88' },
        },
      },
      screens: {
        'iphone-14-pro': '393px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.pt-safe-top': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.pb-safe-bottom': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.pl-safe-left': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.pr-safe-right': {
          'padding-right': 'env(safe-area-inset-right)',
        },
        '.mt-safe-top': {
          'margin-top': 'env(safe-area-inset-top)',
        },
        '.mb-safe-bottom': {
          'margin-bottom': 'env(safe-area-inset-bottom)',
        },
        '.ml-safe-left': {
          'margin-left': 'env(safe-area-inset-left)',
        },
        '.mr-safe-right': {
          'margin-right': 'env(safe-area-inset-right)',
        },
      }
      
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
} 