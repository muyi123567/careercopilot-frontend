/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'oklch(97.5% 0.01 85 / <alpha-value>)',
        surface: 'oklch(100% 0 0 / <alpha-value>)',
        ink: {
          900: 'oklch(21% 0.012 50 / <alpha-value>)',
          800: 'oklch(28% 0.012 50 / <alpha-value>)',
          700: 'oklch(36% 0.012 50 / <alpha-value>)',
          600: 'oklch(44% 0.015 50 / <alpha-value>)',
          500: 'oklch(54% 0.015 50 / <alpha-value>)',
          400: 'oklch(70% 0.01 50 / <alpha-value>)',
          300: 'oklch(82% 0.008 50 / <alpha-value>)',
        },
        brand: {
          50: 'oklch(97% 0.02 36 / <alpha-value>)',
          100: 'oklch(94% 0.04 36 / <alpha-value>)',
          200: 'oklch(88% 0.07 36 / <alpha-value>)',
          300: 'oklch(78% 0.10 36 / <alpha-value>)',
          400: 'oklch(67% 0.13 36 / <alpha-value>)',
          500: 'oklch(61% 0.14 36 / <alpha-value>)',
          600: 'oklch(52% 0.15 36 / <alpha-value>)',
          700: 'oklch(45% 0.14 36 / <alpha-value>)',
          800: 'oklch(39% 0.13 36 / <alpha-value>)',
          900: 'oklch(32% 0.11 36 / <alpha-value>)',
        },
        teal: {
          50: 'oklch(95% 0.03 155 / <alpha-value>)',
          100: 'oklch(91% 0.05 155 / <alpha-value>)',
          500: 'oklch(58% 0.09 155 / <alpha-value>)',
          600: 'oklch(50% 0.09 155 / <alpha-value>)',
          700: 'oklch(43% 0.08 155 / <alpha-value>)',
        },
        gold: {
          50: 'oklch(97% 0.03 85 / <alpha-value>)',
          100: 'oklch(93% 0.06 85 / <alpha-value>)',
          400: 'oklch(72% 0.12 85 / <alpha-value>)',
          500: 'oklch(62% 0.13 85 / <alpha-value>)',
          600: 'oklch(52% 0.12 85 / <alpha-value>)',
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
        focus: '0 0 0 3px oklch(64% 0.14 36 / 0.4)',
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

