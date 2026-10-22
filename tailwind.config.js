module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefaf3',
          100: '#d9f4e5',
          500: '#1f7a52',
          700: '#145a3d',
          900: '#0b3525'
        },
        gold: '#d4af37'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
