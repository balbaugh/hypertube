require('dotenv').config();

// const PORT = process.env.PORT;

module.exports = {
	HIMOAPIKEY: process.env.HIMOAPIKEY,
	pgUser: process.env.PGUSER,
	pgHost: process.env.PGHOST,
	pgDatabase: process.env.PGDATABASE,
	pgPassword: process.env.PGPASSWORD,
	pgPort: process.env.PGPORT,
	PORT: process.env.PORT,
	EMAIL: process.env.EMAIL,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	UID_42: process.env.UID_42,
	SECRET_42: process.env.SECRET_42,
	GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
	OPENSUB_API: process.env.OPENSUB_API,
};
