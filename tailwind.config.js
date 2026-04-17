// tailwind.config.js
export default {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        witt: ['Wittgenstain', 'sans-serif'],
      },
      maxWidth: {
        '1/5': '20%',
        '1/4': '25%',
        '1/3': '33%',
      },
      // Custom color palette
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Main primary
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Main secondary
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef', // Main accent
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      // Custom typography scale
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }], // 56px
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 40px
        'h2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }], // 30px
        'h3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }], // 24px
        'body-lg': ['1.125rem', { lineHeight: '1.7', fontWeight: '400' }], // 18px
        'body': ['1rem', { lineHeight: '1.7', fontWeight: '400' }], // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }], // 14px
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }], // 12px
      },
      // Custom spacing values
      spacing: {
        18: '4.5rem', // 72px
        22: '5.5rem', // 88px
        26: '6.5rem', // 104px
        30: '7.5rem', // 120px
      },
      // Custom transition durations
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
      // Custom transition timing function
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      // Shadow utilities for card elevation
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'DEFAULT':
          '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
