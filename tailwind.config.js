/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        csPurpleDeep: "#4C00B0",
        csPurpleBright: "#6D00F5",
        csLavender: "#B085FF",
        csAqua: "#00B3C6",
        csWhite: "#FFFFFF",
        csDark: "#0A0A0A",
        csDark2: "#111111",
      }
    },
  },
  plugins: [],
};
