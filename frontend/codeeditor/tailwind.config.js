/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    screens: {
      
      '3xl': {'max': '2000px'},

      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '868px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
      
      'xs': {'max': '479px'},
      // => @media (max-width: 479px) { ... }

      'xxs': {'max': '359px'},
      // => @media (max-width: 359px) { ... }
    }
  },
  plugins: [],
}
