/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        
          ibmblue: '#1f70c1',
          ibmlight: '#f4f4f4',
          ibmdark: '#0f62fe',
          ibmborder: '#dcdcdc',
    
      },
    },
  },
  plugins: [],
}
