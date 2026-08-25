/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4f1",
          100: "#d6e5dd",
          200: "#adcabc",
          300: "#84af9a",
          400: "#5c9479",
          500: "#3d7a5f",
          600: "#2c5f48",
          700: "#254e3c",
          800: "#1e3f31",
          900: "#183328",
          950: "#0e1e18",
        },
        charcoal: {
          50: "#f4f5f5",
          100: "#e5e6e7",
          200: "#c7c9cb",
          300: "#9a9ea1",
          400: "#6b6f73",
          500: "#4a4e52",
          600: "#34383b",
          700: "#26292b",
          800: "#1a1c1e",
          900: "#111213",
          950: "#0a0a0b",
        },
        accent: {
          50: "#fdf3ec",
          100: "#fbe3d0",
          400: "#e08a3c",
          500: "#c96f24",
          600: "#a85a1c",
        },
        surface: {
          DEFAULT: "#faf9f7",
          alt: "#f2f1ed",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "'Segoe UI'", "system-ui", "sans-serif"],
        display: ["'Archivo'", "'Inter'", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest2: "-0.045em",
      },
      boxShadow: {
        card: "0 1px 2px rgba(17, 18, 19, 0.06), 0 1px 3px rgba(17, 18, 19, 0.04)",
      },
      borderRadius: {
        sm: "3px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};
