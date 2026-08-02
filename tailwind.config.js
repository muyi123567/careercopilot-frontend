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
          200: '#E5DFD8',
          100: '#F0ECE6',
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
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#059669',
          600: '#047857',
          700: '#065F46',
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
        line: 'rgba(33,29,26,0.10)',
        scrim: 'rgba(33,29,26,0.5)',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', '"PingFang SC"', '"Noto Sans SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['system-ui', '-apple-system', '"PingFang SC"', '"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(33,29,26,0.04), 0 4px 16px -8px rgba(33,29,26,0.08)',
        lift: '0 2px 8px rgba(33,29,26,0.05), 0 16px 32px -12px rgba(33,29,26,0.14)',
        focus: '0 0 0 3px rgba(217,119,6,0.25)',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        dash: {
          from: { strokeDashoffset: '14' },
          to: { strokeDashoffset: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
};
