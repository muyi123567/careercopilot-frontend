/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        surface: '#FFFFFF',
        ink: {
          900: '#211D1A',
          800: '#2E2925',
          700: '#3D3733',
          600: '#4E463F',
          500: '#6B6258',
          400: '#9A9088',
          300: '#C4BBB2',
        },
        brand: {
          50: '#FDF5F2',
          100: '#F9E8E0',
          200: '#F0CFC2',
          300: '#E0A894',
          400: '#D07A5E',
          500: '#C4553B',
          600: '#A8432C',
          700: '#8B3622',
          800: '#722C1C',
          900: '#5C2316',
        },
        teal: {
          50: '#EDF7F2',
          100: '#D8EFE4',
          500: '#3E8E6B',
          600: '#2E7A58',
          700: '#256647',
        },
        gold: {
          50: '#FBF7EE',
          100: '#F3E9D0',
          400: '#C49A3E',
          500: '#A67E2E',
          600: '#8A6824',
        },
        line: 'rgba(33,29,26,0.14)',
        scrim: 'rgba(33,29,26,0.5)',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', '"Noto Serif SC"', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(33,29,26,0.04), 0 8px 24px -12px rgba(33,29,26,0.14)',
        lift: '0 2px 8px rgba(33,29,26,0.05), 0 24px 48px -16px rgba(33,29,26,0.22)',
        glow: '0 0 0 1px rgba(226,114,91,0.1), 0 8px 32px -8px rgba(226,114,91,0.2)',
        focus: '0 0 0 3px rgba(196,85,59,0.4)',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'drawer-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'float': 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
