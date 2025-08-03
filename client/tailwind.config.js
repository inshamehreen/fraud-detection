module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#113F67',
        secondary: '#34699A',
        accent: '#58A0C8',
        highlight: '#FDF5AA',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        slab: ['Alfa Slab One', 'cursive'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        slideInUp: 'slideInUp 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
