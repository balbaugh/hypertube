// @type {import('tailwindcss').Config}

module.exports = {
  content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./src/*.{js,jsx,ts,tsx}",
          'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
	],
  theme: {
    extend: {},
    screens: {

      'mobile': '320px',
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px'
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
