import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:    "#0c1a14",
        forest: "#133a25",
        moss:   "#1e5435",
        sage:   "#2d7a4a",
        gold:   "#d4a843",
        amber:  "#f0c060",
        cream:  "#f7f3ec",
        linen:  "#ede8df",
        teal:   "#5bbfa0",
        mist:   "#8a9e92",
      },
      fontFamily: {
        sans:  ["var(--font-outfit)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        mono:  ["var(--font-dm-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
