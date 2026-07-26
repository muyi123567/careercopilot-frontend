/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm editorial paper + ink (tinted neutrals, never pure black/white).
        // <alpha-value> keeps opacity modifiers (/10, /40 ...) working with oklch.
        paper: 'oklch(98% 0.008 85 / <alpha-value>)',
        surface: 'oklch(100% 0 0 / <alpha-value>)',
        ink: {
          900: 'oklch(24% 0.02 264 / <alpha-value>)',
          800: 'oklch(32% 0.02 264 / <alpha-value>)',
          700: 'oklch(42% 0.02 264 / <alpha-value>)',
          600: 'oklch(52% 0.02 264 / <alpha-value>)',
          500: 'oklch(60% 0.02 264 / <alpha-value>)',
          400: 'oklch(70% 0.02 264 / <alpha-value>)',
        },
        // One confident accent — deep indigo, used sparingly (60-30-10)
        brand: {
          50: 'oklch(96% 0.03 264 / <alpha-value>)',
          100: 'oklch(92% 0.05 264 / <alpha-value>)',
          200: 'oklch(85% 0.08 264 / <alpha-value>)',
          300: 'oklch(75% 0.11 264 / <alpha-value>)',
          400: 'oklch(64% 0.13 264 / <alpha-value>)',
          500: 'oklch(55% 0.14 264 / <alpha-value>)',
          600: 'oklch(48% 0.14 264 / <alpha-value>)',
          700: 'oklch(42% 0.13 264 / <alpha-value>)',
          800: 'oklch(36% 0.12 264 / <alpha-value>)',
        },
        teal: {
          50: 'oklch(96% 0.03 200 / <alpha-value>)',
          100: 'oklch(92% 0.05 200 / <alpha-value>)',
          600: 'oklch(50% 0.09 200 / <alpha-value>)',
          700: 'oklch(44% 0.09 200 / <alpha-value>)',
        },
        // Flat helpers (pre-mixed alpha, no modifier needed)
        line: 'oklch(24% 0.02 264 / 0.09)',
        scrim: 'oklch(24% 0.02 264 / 0.45)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,22,40,0.04), 0 10px 30px -18px rgba(20,22,40,0.22)',
        lift: '0 2px 6px rgba(20,22,40,0.05), 0 24px 50px -22px rgba(20,22,40,0.28)',
        focus: '0 0 0 3px oklch(64% 0.13 264 / 0.45)',
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
