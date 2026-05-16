/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cinzel", "Georgia", "serif"],
        body: ["Inter", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        ember: "0 0 28px rgba(244, 127, 54, 0.28)",
        blood: "0 16px 46px rgba(20, 4, 7, 0.55)",
      },
    },
  },
  plugins: [],
};
