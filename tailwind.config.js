/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs', './public/**/*.js'],
  safelist: ['text-red_bull', 'text-williams', 'text-rb', 'text-mclaren', 'text-alpine', 'text-ferrari', 'text-mercedes', 'text-aston_martin', 'text-haas', 'text-sauber', 'stewardsTxt', 'stewardsBg', 'bg-red_bull', 'bg-williams', 'bg-rb', 'bg-mclaren', 'bg-alpine', 'bg-ferrari', 'bg-mercedes', 'bg-aston_martin', 'bg-haas', 'bg-sauber', 'border-red_bull', 'border-williams', 'border-rb', 'border-mclaren', 'border-alpine', 'border-ferrari', 'border-mercedes', 'border-aston_martin', 'border-haas', 'border-sauber',
    'main-color', 'bg-light', 'bg-back-light', 'bg-second-light', 'text-light', 'border-light', 'bg-dark', 'bg-back-dark', 'bg-second-dark', 'text-dark', 'border-dark'],
  theme: {
    extend: {
      fontFamily: {
        F1Bold: ['F1Bold', 'sans-serif'],
        F1Regular: ['F1Regular', 'sans-serif'],
        F1Wide: ['F1Wide', 'sans-serif']
      },
      colors: {
        'main-color': '#058785',
        'back-light': 'white',
        'second-light': '#E9E9E7',
        'light': 'black',
        'back-dark': '#191919',
        'second-dark': '#333333',
        'dark': 'white',
        'deconnect': '#F6A60B',
        'red_bull': '#3671C6',
        'williams': '#64C4FF',
        'rb': '#6692FF',
        'mclaren': '#FF8000',
        'alpine': '#0093CC',
        'ferrari': '#E80020',
        'mercedes': '#27F4D2',
        'aston_martin': '#229971',
        'haas': '#B6BABD',
        'sauber': '#52E252',
        'stewardsTxt': '#011132',
        'stewardsBg': '#E1E8F2'
      }
    },
  },
  plugins: [],
}