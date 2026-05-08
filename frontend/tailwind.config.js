/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          base: 'var(--surface-base)',
          card: 'var(--surface-card)',
          elevated: 'var(--surface-elevated)',
          line: 'var(--surface-line)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          dim: 'var(--ink-dim)',
          faint: 'var(--ink-faint)',
        },
        brand: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
        },
        accent: {
          green: '#22C55E',
          amber: '#F59E0B',
          rose: '#F43F5E',
          cyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        'flow': {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'log-in': {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        'flow': 'flow 1.6s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'log-in': 'log-in 0.25s ease-out forwards',
      },
    },
  },
  plugins: [],
};
