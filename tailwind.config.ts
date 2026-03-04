import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#1e1f22",
          secondary: "#2b2d31",
          tertiary: "#313338",
        },
        text: {
          primary: "#f2f3f5",
          secondary: "#b5bac1",
          muted: "#6d6f78",
        },
        accent: "#5865f2",
        "accent-hover": "#4752c4",
        border: "#3f4147",
        live: "#23a559",
        offline: "#6d6f78",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
