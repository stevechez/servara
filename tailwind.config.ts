import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // <--- This is the magic line that makes next-themes work
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom brand colors here later if you want!
      },
      animation: {
        'bounce-short': 'bounce 1s ease-in-out 1',
      }
    },
  },
  plugins: [],
}
export default config