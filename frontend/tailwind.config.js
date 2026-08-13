/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: "#B6191B",
          hover: "#8F1215",
          soft: "#D3A095",
        },
        cream: {
          DEFAULT: "#F7DFC9",
          panel: "#FFF8F3",
        },
        espresso: "#19130D",
        cocoa: "#886057",
        sand: "#EAD4C4",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      boxShadow: {
        luxury: "0 18px 44px rgba(25, 19, 13, 0.1)",
        "luxury-lg": "0 32px 90px rgba(25, 19, 13, 0.18)",
        glow: "0 8px 32px rgba(182, 25, 27, 0.24)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.12) translate(-1.2%, -1.2%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-33.333%)" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "ken-burns": "ken-burns 10s ease-in-out forwards",
        float: "float 5s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
        "infinite-scroll": "infinite-scroll 25s linear infinite",
        "progress-fill": "progress-fill 5s linear forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};
