const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colors.cyan
      }
    },
    container: {
      center: true
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
