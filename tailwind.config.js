/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["Inter", "system-ui", "sans-serif"],
      body: ["Inter", "system-ui", "sans-serif"],
    },
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1280px",
      xl: "1440px",
    },
    extend: {},
  },
  plugins: [],
};
