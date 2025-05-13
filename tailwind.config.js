/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/**/*.css"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      transitionProperty: {
        height: "height, max-height",
      },
    },
  },
}
