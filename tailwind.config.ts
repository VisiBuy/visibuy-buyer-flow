import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}",
    "./src/shared/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      // Visibuy breakpoints
      sm: "360px", // mobile
      md: "600px", // tablet
      lg: "1280px", // desktop
    },
    extend: {
      fontFamily: {
        // Secondary font for body
        sans: ["var(--font-open-sans)", "system-ui", "sans-serif"],
        // Primary font for headings
        heading: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      colors: {
        // Brand identity
        brand: {
          primary: {
            DEFAULT: "#007BFF", // Visibuy Blue
            foreground: "#FFFFFF",
          },
          success: {
            DEFAULT: "#28A745", // Visibuy Green
            foreground: "#FFFFFF",
          },
          danger: {
            DEFAULT: "#DC3545",
            foreground: "#FFFFFF",
          },
        },
        secondary: {
          light: "#F1F1F1",
          dark: "#333333",
        },
        neutral: {
          0: "#000000",
          50: "#FFFFFF",
          100: "#F8F9FA",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
      },
      borderRadius: {
        card: "12px",
        buttonLg: "12px",
        buttonMd: "10px",
        buttonSm: "8px",
        input: "8px",
      },
      boxShadow: {
        level1: "0px 2px 8px rgba(0,0,0,0.06)",
        level2: "0px 4px 12px rgba(0,0,0,0.08)",
        level3: "0px 6px 20px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
