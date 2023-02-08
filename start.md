# FRONT
npm install
	axios
	--save react-router-dom
	tailwind css

npx tailwindcss init

tailwind.config.js =
// @type {import('tailwindcss').Config}

module.exports = {
  content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./src/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
	],
  theme: {
    extend: {},
    // DONT KNOW ABOUT THIS
    screens: {
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px'
    }

  },
  plugins: [
    require('flowbite/plugin')
  ],
}


index.css =
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

npm install
	flowbite flowbite-react
	--save react-spinners
  react-player


tailwind.config.js =
// @type {import('tailwindcss').Config}

module.exports = {
  content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"./src/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
	],
  theme: {
    extend: {},
    // DONT KNOW ABOUT THIS
    screens: {
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px'
    }

  },
  plugins: [
    require('flowbite/plugin')
  ],
}


# BACK
npm install
	--save-dev nodemon
	express
	cors
	--save dotenv
	--save-dev eslint-config-airbnb

.eslintrc =
	{
  "extends": "airbnb"
	}

npx install-peerdeps --dev eslint-config-airbnb
npm install
	pg
	body-parser
	cookie-parser
	express-session
  torrent-stream
