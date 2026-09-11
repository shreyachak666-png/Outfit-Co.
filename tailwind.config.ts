import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF7F0",
        "soft-white": "#FFFDFB",
        cream: "#F6EEE0",
        beige: "#EADFC8",
        blush: "#F1DAD4",
        rose: "#D9A9A4",
        chocolate: {
          DEFAULT: "#3A2A20",
          light: "#5A4234",
        },
        burgundy: {
          DEFAULT: "#722F3A",
          light: "#8C4350",
          dark: "#4E1F27",
        },
        ink: "#2B2320",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Jost"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(58, 42, 32, 0.25)",
        "card-hover": "0 16px 40px -14px rgba(58, 42, 32, 0.35)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
