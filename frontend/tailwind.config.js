/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fffdf8',
          100: '#faf6ec',
          200: '#f0e8d6',
          300: '#e5d9c0',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#e8b84a',
          500: '#c9952c',
          600: '#a67a22',
          700: '#85621c',
          800: '#6b4f18',
          900: '#5a4216',
        },
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#ea7c2a',
          600: '#c45f00',
          700: '#9c4a00',
        },
        maroon: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f7cad4',
          300: '#e8a0b0',
          400: '#d4728a',
          500: '#b84d67',
          600: '#9c3a54',
          700: '#7d2d44',
          800: '#5c2234',
          900: '#451a29',
        },
        lotus: {
          50: '#f8faf7',
          100: '#eef4ea',
          200: '#d8e5d4',
          300: '#b8c9b2',
          600: '#4a5c47',
          700: '#3a4a38',
          800: '#2d3a2c',
          900: '#1e2820',
        },
        forest: {
          50: '#f3faf6',
          100: '#d9efe3',
          600: '#2d5a45',
          700: '#234a3a',
          800: '#1a362c',
          900: '#12261f',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'temple-hero':
          'radial-gradient(ellipse 100% 85% at 50% -35%, rgba(201,149,44,0.22), transparent 58%), radial-gradient(ellipse 70% 50% at 0% 0%, rgba(125,45,68,0.06), transparent 50%), radial-gradient(ellipse 60% 45% at 100% 10%, rgba(234,124,42,0.08), transparent 48%), linear-gradient(180deg, #fffdf8 0%, #faf6ec 48%, #f3ebdc 100%)',
        'temple-soft':
          'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,149,44,0.14), transparent 50%), linear-gradient(180deg, #faf6ec 0%, #fffdf8 100%)',
        'gold-shine': 'linear-gradient(125deg, rgba(255,255,255,0.65) 0%, transparent 40%, rgba(201,149,44,0.15) 100%)',
      },
      boxShadow: {
        soft: '0 25px 50px -12px rgba(69, 26, 41, 0.12)',
        card: '0 4px 24px -4px rgba(69, 26, 41, 0.08)',
        gold: '0 0 0 1px rgba(201, 149, 44, 0.25), 0 12px 40px -12px rgba(201, 149, 44, 0.2)',
      },
    },
  },
  plugins: [],
}
