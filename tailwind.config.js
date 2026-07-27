/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm editorial paper + ink (tinted neutrals, never pure black/white).
        // <alpha-value> keeps opacity modifiers (/10, /40 ...) working with oklch.
        paper: 'oklch(97% 0.012 85 / <alpha-value>)',
        surface: 'oklch(100% 0 0 / <alpha-value>)',
        ink: {
          900: 'oklch(23% 0.01 50 / <alpha-value>)',
          800: 'oklch(30% 0.01 50 / <alpha-value>)',
          700: 'oklch(38% 0.01 50 / <alpha-value>)',
          600: 'oklch(46% 0.015 50 / <alpha-value>)',
          500: 'oklch(56% 0.015 50 / <alpha-value>)',
          400: 'oklch(72% 0.01 50 / <alpha-value>)',
        },
        // One confident accent — warm Terracotta (matches design draft, #E2725B family).
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
        },
        // Privacy/trust semantic — warm sage green (#3E8E6B family).
        teal: {
          50: 'oklch(94% 0.03 155 / <alpha-value>)',
          100: 'oklch(90% 0.05 155 / <alpha-value>)',
          600: 'oklch(58% 0.09 155 / <alpha-value>)',
          700: 'oklch(50% 0.09 155 / <alpha-value>)',
        },
        // Flat helpers (pre-mixed alpha, no modifier needed)
        line: 'rgba(33,29,26,0.10)',
        scrim: 'rgba(33,29,26,0.45)',
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
        card: '0 1px 2px rgba(33,29,26,0.04), 0 10px 30px -18px rgba(33,29,26,0.22)',
        lift: '0 2px 6px rgba(33,29,26,0.05), 0 24px 50px -22px rgba(33,29,26,0.28)',
        focus: '0 0 0 3px oklch(64% 0.14 36 / 0.45)',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
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
      },
      animation: {
        'slide-up': 'slide-up 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
};
