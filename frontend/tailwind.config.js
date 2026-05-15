/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fff9ed',
          100: '#ffefcf',
          200: '#ffd999',
          300: '#ffc14d',
          400: '#f4a300',
          500: '#e07800',
          600: '#c45f00',
          700: '#9c4a00',
          800: '#7a3b08',
          900: '#5c2f0d',
        },
        saffron: {
          400: '#ffb020',
          500: '#f4a300',
          600: '#e07800',
        },
        lotus: {
          50: '#f6faf7',
          100: '#e8f0ea',
          200: '#d0dfd4',
          800: '#2a3d34',
          900: '#0e1511',
        },
        forest: {
          700: '#1e3d2f',
          800: '#152a22',
          900: '#0f1f18',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'lotus-radial':
          'radial-gradient(ellipse 120% 90% at 50% -25%, rgba(244,163,0,0.22), transparent 55%), radial-gradient(ellipse 90% 70% at 100% 20%, rgba(46,120,90,0.12), transparent 50%), radial-gradient(ellipse 80% 60% at 0% 80%, rgba(30,61,47,0.35), transparent 45%)',
        'gold-shine':
          'linear-gradient(125deg, rgba(255,255,255,0.06) 0%, transparent 38%, rgba(244,163,0,0.12) 100%)',
      },
      boxShadow: {
        soft: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        gold: '0 0 48px rgba(244, 163, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
