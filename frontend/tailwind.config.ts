import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0c0d10',
          900: '#13151a',
          850: '#191c23',
          800: '#232730',
          700: '#333844',
          600: '#484f60',
          500: '#6e768a',
          400: '#9ba2b5',
          300: '#c5cad7',
          100: '#f1f3f7',
        },
        paper: {
          50: '#ffffff',
          100: '#fbfaf7',
          200: '#f4f1ea',
          300: '#e7e2d6',
          400: '#c9c2b3',
          700: '#524e45',
          800: '#2c2923',
          900: '#171512',
        },
        saffron: {
          50: '#fdf4ef',
          100: '#fae5d9',
          200: '#f4c7af',
          300: '#eda27e',
          400: '#e3774d',
          500: '#d46539', // Signature terracotta/saffron
          600: '#b84e27',
          700: '#943c1e',
          800: '#76311b',
        },
        prussian: {
          50: '#f0f5f8',
          100: '#dbe7ee',
          200: '#b9d1dd',
          300: '#8db4c7',
          400: '#5f92ab',
          500: '#446b82', // Signature cool counter-tone
          600: '#345468',
          700: '#2a4454',
          800: '#253945',
        },
        ochre: {
          400: '#dfaf5b',
          500: '#c89547',
          600: '#a77834',
        },
        sage: {
          400: '#8ca998',
          500: '#6f8d7b',
          600: '#557060',
        },
        crimson: {
          400: '#d96455',
          500: '#b84735',
          600: '#963424',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Newsreader', 'Georgia', 'serif'],
        sans: ['"Instrument Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
        'lifted': '0 4px 16px -2px rgba(0, 0, 0, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
