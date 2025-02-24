import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blackCustom: "#322625",
        greyCustom: "#ebebeb",
        blueCustom: "#c0e3e5",
        yellowCustom: "#fdc936"
      },
      fontFamily: {
        neutra: ['"Neutra Text"', 'sans-serif']
      }
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
} satisfies Config;
