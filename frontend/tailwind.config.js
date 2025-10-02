/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alfa: ['"Alfa Slab One"', 'cursive'],
        archivo: ['Archivo', 'sans-serif'],
      },
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        text: "var(--text)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
