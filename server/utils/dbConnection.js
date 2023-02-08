const config = require('./config');
const { Pool } = require('pg');

const pool = new Pool({
	user: config.pgUser,
	host: config.pgHost,
	database: config.pgDatabase,
	password: config.pgPassword,
	port: config.pgPort,
	max: 30
});

const connectDB = () => {
	pool.connect((err, client, release) => {
		if (err) {
			console.log('Error acquiring client', err.stack);
			console.log('Retrying in 5 seconds...');
			setTimeout(connectDB, 5000);
		}
		else {
			console.log(`Connected to database ${config.pgDatabase}.`)
		}
	})
}

module.exports = {
	pool, connectDB
}
