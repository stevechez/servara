import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}', // Ensure this covers all subfolders
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 4px 40px -2px rgba(0, 0, 0, 0.04)',
        float: '0 10px 50px -5px rgba(0, 0, 0, 0.08)',
        glow: '0 0 20px rgba(59, 130, 246, 0.15)', // Blue glow for active states
      },
      colors: {
        // You can add custom brand colors here later if you want!
      },
      animation: {
        'bounce-short': 'bounce 1s ease-in-out 1',
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
