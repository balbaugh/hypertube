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
}
