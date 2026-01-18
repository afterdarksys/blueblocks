/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { primary: { 500: "#8b5cf6", 600: "#7c3aed", 700: "#6d28d9" } } } },
  plugins: [],
};
