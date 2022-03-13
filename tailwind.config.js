module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [],
  safelist: process.env.NODE_ENV === 'development' ? [{ pattern: /.*/ }] : []
}
