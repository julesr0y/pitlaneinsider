/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs', './public/**/*.js'],
  safelist: ['text-red-bull', 'text-williams', 'text-rb', 'text-mclaren', 'text-alpine', 'text-ferrari', 'text-mercedes', 'text-aston-martin', 'text-haas', 'text-kick-sauber', 'text-red_bull', 'text-aston_martin', 'text-sauber', 'stewardsTxt', 'stewardsBg', 'bg-red-bull', 'bg-williams', 'bg-rb', 'bg-mclaren', 'bg-alpine', 'bg-ferrari', 'bg-mercedes', 'bg-aston-martin', 'bg-haas', 'bg-kick-sauber', 'bg-red_bull', 'bg-aston_martin', 'bg-sauber', 'border-red-bull', 'border-williams', 'border-rb', 'border-mclaren', 'border-alpine', 'border-ferrari', 'border-mercedes', 'border-aston-martin', 'border-haas', 'border-kick-sauber', 'border-red_bull', 'border-aston_martin', 'border-sauber',
    'main-color', 'bg-light', 'bg-b-light', 'bg-s-light', 'text-t-s-light', 'text-light', 'border-light', 'bg-dark', 'bg-b-dark', 'bg-s-dark', 'text-t-s-dark', 'text-dark', 'border-dark'],
  theme: {
    extend: {
      fontFamily: {
        F1Bold: ['F1Bold', 'sans-serif'],
        F1Regular: ['F1Regular', 'sans-serif'],
        F1Wide: ['F1Wide', 'sans-serif']
      },
      colors: {
        'main-color': '#058785',
        'b-light': 'white',
        's-light': '#E9E9E7',
        't-s-light': '#4b5563',
        'light': 'black',
        'b-dark': '#191919',
        's-dark': '#333333',
        't-s-dark': '#d1d5db',
        'dark': 'white',
        'deconnect': '#F6A60B',
        'red-bull': '#3671C6',
        'red_bull': '#3671C6', // id pour api OpenF1 (live)
        'williams': '#64C4FF',
        'rb': '#6692FF',
        'mclaren': '#FF8000',
        'alpine': '#0093CC',
        'ferrari': '#E80020',
        'mercedes': '#27F4D2',
        'aston-martin': '#229971',
        'aston_martin': '#229971', // id pour api OpenF1 (live)
        'haas': '#B6BABD',
        'kick-sauber': '#52E252',
        'sauber': '#52E252', // id pour api OpenF1 (live)
        'stewardsTxt': '#011132',
        'stewardsBg': '#E1E8F2',
        'gold': 'gold'
      }
    },
  },
  plugins: [],
}