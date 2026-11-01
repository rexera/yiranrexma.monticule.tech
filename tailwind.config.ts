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
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"]
      },
      colors: {
        // Editorial surface tokens. Swapped per theme in globals.css so a
        // single class (text-ink, border-line/15, bg-paper) works in both.
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        // Monticule brand palette. The DEFAULT/foreground/on/text accents are
        // driven by CSS variables so dark mode can swap the olive accent
        // for a pale-yellow one; the numbered scale stays static.
        // #f4f7d5 cream · #c1c989 light green · #81986a green · #4a5842 dark olive · #1a2118 near-black
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          foreground: "rgb(var(--brand-foreground) / <alpha-value>)",
          on: "rgb(var(--brand-on) / <alpha-value>)",
          // Text-safe accent (VI Deep Olive): passes AA on paper at small sizes.
          text: "rgb(var(--brand-text) / <alpha-value>)",
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
        // Monticule VI palette (02-color/palette.json) — accent range only.
        // The VI's usage rules (ratios, font mandates) do not apply here;
        // these are decorative accents: dots, tints, the hero haze.
        vi: {
          sprout: "#e0e7a0",
          oliveLight: "#c1c989",
          olive: "#7d9569",
          sage: "#9fb296",
          wordmark: "#65745a",
          deep: "#5e6c53",
          cream: "#f2f4d6",
          ground: "#98a78e",
          ink: "#232a1c"
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
