import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        muted: "rgb(var(--muted))",
        card: "rgb(var(--card))",
        border: "rgb(var(--border))",
        primary: "rgb(var(--primary))",
        secondary: "rgb(var(--secondary))",
        accent: "rgb(var(--accent))",
        destructive: "rgb(var(--destructive))",
      },
      fontFamily: {
        allura: ["var(--font-allura)", "cursive", "sans-serif"],
        ibmPlexMono: ["var(--font-ibm-plex-mono)", "monospace", "sans-serif"],
      },
    },
  },
  animation: {
    fadeIn: "fadeIn 0.5s ease-in-out",
  },
  keyframes: {
    fadeIn: {
      "0%": { opacity: "0" },
      "100%": { opacity: "1" },
    },
  },
  plugins: [],
};

export default config;
