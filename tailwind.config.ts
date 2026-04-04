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
        paper: "#f0e6d3",
        "paper-light": "#f8f2e8",
        "paper-dark": "#e6d9c3",
        accent: "#8b5e3c",
        "accent-light": "#a67c5b",
        "accent-dark": "#6d4a2f",
        ink: "#3d2b1f",
        "ink-light": "#5c4535",
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "serif"],
        ui: ["system-ui", "sans-serif"],
      },
      boxShadow: {
        neumorphic:
          "4px 4px 10px rgba(180,150,110,.45), -2px -2px 6px rgba(255,250,240,.9)",
        "neumorphic-inset":
          "inset 2px 2px 6px rgba(180,150,110,.45), inset -2px -2px 5px rgba(255,250,240,.9)",
        "neumorphic-sm":
          "2px 2px 5px rgba(180,150,110,.35), -1px -1px 3px rgba(255,250,240,.8)",
      },
    },
  },
  plugins: [],
};
export default config;
