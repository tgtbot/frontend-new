import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        ...colors,
        bgB: "#18191b",
        bgW: "#EFEFEF",
        off: "#3B3B38",
        signBlack: "#3F3F3F",
        error: "#FF6928",
        buttonBg: "#cd7962",
      },
      boxShadow: {
        skip: "inset 0 -40px 200px -100px rgb(0 0 0 / 1)",
      },
    },
  },
  plugins: [],
};
export default config;
