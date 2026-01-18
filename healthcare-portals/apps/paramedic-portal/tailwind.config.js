/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { primary: { 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c" } } } },
  plugins: [],
};
