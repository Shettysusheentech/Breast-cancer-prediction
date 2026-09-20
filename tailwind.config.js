/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3F6F8",
        panel: "#FFFFFF",
        line: "#DCE3E8",
        ink: "#16233A",
        inkMuted: "#5A6B7D",
        clinical: "#0891B2",
        clinicalDark: "#0E7490",
        benign: "#16A34A",
        malignant: "#DC2626",
      },
      fontFamily: {
        sans: ["'Source Sans 3'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
