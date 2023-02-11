const config = require('../utils/config');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const dbConn = require('../utils/dbConnection');


router.get('/login', (req, res) => {
	if (req.session.user) {
		dbConn.pool.query('SELECT status FROM users WHERE username = $1',
		[req.session.user.username],
		(err, result) => {
			if (err)
				console.log('req.user.session', err);
			else {
				res.send({ loggedIn: true, user: req.session.user, result });
				// console.log('LOGINNNRESULT', result)
			}
		})
		// console.log('session', req.session.user)
	}
	else
		res.send({ loggedIn: false });
 })

router.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (username.length < 4 || username.length > 20)
		return res.send({ message: `Username must be between 4 - 20 characters.`})
	if (!username.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Username can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)'})
	//password checks
	if (password.length < 8 || password.length > 20)
		return res.send({ message: `Password must be between 8 - 20 characters.`})
	if (!password.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Password can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)'})

	dbConn.pool.query('SELECT * FROM users WHERE username = $1',
	[username],
	(err, result) => {
		if (err)
			console.log('Login', err);
		if (result.rowCount === 1) {
			bcrypt.compare(password, result.rows[0].password, (error, response) => {
				if (response) {
					if (result.rows[0].status === 0) {
						return res.send({ message: 'Verify your email thanks.'});
					}
					req.session.user = result.rows[0];
					res.send({ result, message: `Logged in as '${username}' `});
				}
				else
					return res.send({ message: `Wrong username / password combo.` });
			})
		}
		else {
			return res.send({ message: 'User doesn\'t exist.'});
		}
	})
 })

 router.get('/logout', (req, res) => {
	req.session.destroy((err, result) => {
	if (err) {
		console.error(err);
		res.sendStatus(500);
	}
	else {
		res.sendStatus(200)
	}
})
}
)

 module.exports = router