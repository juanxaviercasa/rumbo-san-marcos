/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidad Rumbo San Marcos
        rumbo: {
          burgundy: '#8B1538',    // Guinda sanmarquina
          dark: '#5A0E2C',        // Más oscuro
          light: '#C41E4D',       // Más claro
          gold: '#D4AF37',        // Dorado
          gray: '#F5F5F5',        // Gris claro
        },
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        // Font weight utilities will be handled by base styles
      },
    },
  },
  plugins: [],
}
