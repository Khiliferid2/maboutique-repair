import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0F1F45",
        navy2: "#14275A",
        blue: "#1E56E0",
        blueLight: "#4C86F5",
        cyan: "#29ABE2",
        orange: "#FF9F43",
        green: "#28C76F",
        red: "#EA5455",
        paper: "#F4F7FC",
        ink: "#1B2430",
        inkSoft: "#6B7280",
        line: "#E3E8F1",
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};

export default config;
