import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B1714',
        paper: '#F6F3ED',
        surface: '#FCFAF6',
        ember: '#BF3B2B',
        'ember-dark': '#9E2E20',
        muted: '#6B655C',
        line: '#E3DDD2',
        bay: '#384227',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        label: '0.22em',
      },
      maxWidth: {
        prose: '68ch',
        shell: '1280px',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'ticker': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        ticker: 'ticker 36s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
