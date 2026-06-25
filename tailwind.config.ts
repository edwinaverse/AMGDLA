import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "#13151a",
          raised: "#1a1d24",
        },
        ink: {
          DEFAULT: "#f4f3ef",
          dim: "#a8abb5",
          faint: "#6c707c",
        },
        sage: {
          DEFAULT: "#8fbf7f",
          dim: "#6fa868",
        },
        grey: {
          DEFAULT: "#c9cbd3",
          dim: "#8d909c",
        },
        ice: {
          DEFAULT: "#8fb4c2",
          dim: "#6c8e9c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
