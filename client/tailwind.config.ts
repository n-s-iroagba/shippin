import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary-blue': "#0097FB",
        'light-blue': "var(--light-blue)",
        'lighter-blue': "#E6F3FF",
        'dark-blue': "#0066CC",
        'border-lighter-blue': "#E6F3FF",
      },
    },
  },
  plugins: [],
} satisfies Config;