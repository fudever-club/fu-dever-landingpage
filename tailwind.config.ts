/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dever-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-dever-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      clipPath: {
        myPolygon: "polygon(0% 10.2%, 100% 0%, 100% 80%, 9.26% 90%, 0% 100%)",
        subPolygon: "polygon(8.5% 89.75%, 100% 79.75%, 100% 100%, 0% 100%)",
      },
      colors: {
        primary: "#0066CC", // WCAG AA compliant (4.56:1 contrast ratio against white)
        "primary-light": "#0098FF",
        "primary-dark": "#004C99", // WCAG AAA compliant (6.7:1)
        highlight: "#D90000",
      },
      backgroundSize: {
        auto: "auto",
        cover: "cover",
        contain: "contain",
        "50%": "50%",
        16: "4rem",
      },
      screens: {
        sm: "360px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1440px", // Extra-large screens
      },
    },
  },
  plugins: [
    require("tailwind-clip-path"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
