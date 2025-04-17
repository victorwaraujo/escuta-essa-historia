/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: "var(--font-display)", 
        body: "var(--font-body)",       
      },
      colors: {
        roxo: {
          400: "#c86bfa",
        },
      },
    },
  },
  plugins: [],
  fontFamily: {
    script: ['"Dancing Script"', 'cursive'],
  }
}