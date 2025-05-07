module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'youtube-red': '#FF0000',
        'youtube-black': '#0F0F0F',
        'youtube-gray': '#272727',
        'youtube-light-gray': '#717171'
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
