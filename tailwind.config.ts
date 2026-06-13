import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#7C5CFC',
          light:   '#F0EBFF',
          dark:    '#6344E0',
          subtle:  '#EDE8FF',
        },
        ink: {
          DEFAULT: '#18181B',
          soft:    '#3F3F46',
          muted:   '#71717A',
          faint:   '#A1A1AA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle:  '#F4F4F5',
          raised:  '#FAFAFA',
          border:  '#E4E4E7',
          hover:   '#F0F0F1',
        },
        blocker: {
          DEFAULT: '#EF4444',
          light:   '#FEF2F2',
          border:  '#FECACA',
        },
        pending: {
          DEFAULT: '#F59E0B',
          light:   '#FFFBEB',
          border:  '#FDE68A',
        },
        success: {
          DEFAULT: '#10B981',
          light:   '#ECFDF5',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
