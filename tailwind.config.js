/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors:{
        'primary1': '#3949AB', // title bars, buttons, and primary actions
        'primary2': '#5C6BC0', // highlights and accents
        'secondary1': '#009688', // secondary buttons and interactive elements
        'secondary2': '#FF6F61', // warnings or error messages
        'background1': '#F5F5F5', // background
        'background2': '#FFFFFF', // cards and content areas
        'text1': '#212121', // primary text
        'text2': '#757575', // secondary text or placeholders
        'text3': '#ffffff'

      }
    },
  },
  plugins: [],
}

