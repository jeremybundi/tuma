import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx,css}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx,css}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx,css}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        poppins: 'var(--font-poppins), sans-serif',
        manrope: 'var(--font-manrope), sans-serif',
        lufga: "'Lufga', sans-serif", // Custom font from CDN
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
} satisfies Config;
