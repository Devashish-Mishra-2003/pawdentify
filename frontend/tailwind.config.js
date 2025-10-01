/** @type {import('tailwindcss').Config} */
export const content = [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
];
export const theme = {
    extend: {
        fontFamily: {
            alfa: ['"Alfa Slab One"', 'cursive'],
            archivo: ['Archivo', 'sans-serif'],
        },
    },
};
export const plugins = [];
