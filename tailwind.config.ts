import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}",
    "./content/blog/**/*.{md,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Apple system stack, defined once as CSS variables in globals.css.
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"]
      },
      colors: {
        // Monticule brand palette. The DEFAULT/foreground/on accents are
        // driven by CSS variables so dark mode can swap the olive accent
        // for a pale-yellow one; the numbered scale stays static.
        // #f4f7d5 cream · #c1c989 light green · #81986a green · #4a5842 dark olive · #1a2118 near-black
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          foreground: "rgb(var(--brand-foreground) / <alpha-value>)",
          on: "rgb(var(--brand-on) / <alpha-value>)",
          50: "#f4f7d5",
          100: "#e9eec2",
          200: "#c1c989",
          300: "#a7b477",
          400: "#81986a",
          500: "#6e8259",
          600: "#4a5842",
          700: "#3b4836",
          800: "#2b3526",
          900: "#1a2118"
        },
        // Neutral scale. Light steps carry the Monticule olive-cream;
        // the dark end (700+) shifts to a brown-tinted near-black — mostly
        // black with a whisper of brown — per the dark-theme direction.
        slate: {
          50: "#f8f5ec",
          100: "#f1eee0",
          200: "#e3ddc7",
          300: "#c6bfa6",
          400: "#a79f84",
          500: "#81986a",
          600: "#4a5842",
          700: "#383026",
          800: "#28221a",
          900: "#17130e",
          950: "#0b0906"
        }
      },
      boxShadow: {
        subtle: "0 10px 30px rgba(26, 33, 24, 0.08)"
      }
    }
  },
  plugins: [typography]
};

export default config;
