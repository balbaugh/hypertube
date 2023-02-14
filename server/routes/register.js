const config = require('../utils/config');
const express = require('express');
const router = express.Router();
const dbConn = require('../utils/dbConnection');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
let algo = 'sha256'

const nodemailer = require('nodemailer');

router.post('/register', (req, res) => {
	const username = req.body.username.toLowerCase();
	const firstname = req.body.firstname;
	const lastname = req.body.lastname;
	const email = req.body.email;
	const password = req.body.password;
	const confPasswd = req.body.confPasswd;
	const verifycode = crypto.createHash(algo).update(username).digest('base64url');

	if (username.length < 4 || username.length > 20)
		return res.send({ message: `Username must be between 4 - 20 characters.` })
	if (!username.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Username can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
	//password checks
	if (password.length < 8 || password.length > 20)
		return res.send({ message: `Password must be between 8 - 20 characters.` })
	if (!password.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Password can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
	if (confPasswd.length < 8 || confPasswd.length > 20)
		return res.send({ message: `Password must be between 8 - 20 characters.` })
	if (!confPasswd.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Password can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
	if (password !== confPasswd)
		return (res.send({ message: 'Passwords doesn\'t match.' }))
	//name checks
	if (!firstname.match(/^[a-zA-Z_.-]+$/))
		return res.send({ message: 'Firstname can only have letters (a-z or A-Z) and some special characters (_.-)' })
	if (firstname.length < 2 || firstname.length > 20)
		return res.send({ message: `Firstname must be between 1 - 20 characters.` })
	if (!lastname.match(/^[a-zA-Z_.-]+$/))
		return res.send({ message: 'Lastname can only have letters (a-z or A-Z) and some special characters (_.-)' })
	if (lastname.length < 2 || lastname.length > 20)
		return res.send({ message: `Lastname must be between 4 - 20 characters.` })
	// email checks
	if (!email.match(/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm))
		return res.send({ message: 'Shady email.' })
	if (email.length > 40)
		return res.send({ message: `Max 40 characters on email.` })

	console.log(config)

	const sendVerifyCode = () => {
		const theMail = {
			from: config.EMAIL,
			to: email,
			subject: 'Verify your HYPERTUBE account!',
			html: `
				<h3>click the link</h3><br />
				<a href="http://localhost:3001/emailverify/${verifycode}"> HERE </a><br />
				<p>Thanks.</p>
			`
		}

		var transporter = nodemailer.createTransport({
			service: 'outlook',
			auth: {
				user: config.EMAIL,
				pass: config.EMAIL_PASSWORD
			}
		})

		transporter.sendMail(theMail, (err) => {
			if (err)
				console.log('MAIL ', err)
		})
	}

	const retrieveId = async () => {
		try {
			var sql = "SELECT id FROM users WHERE username = $1;"
			var { rows } = await dbConn.pool.query(sql, [username])
			return (rows[0])
		} catch (error) {
			console.error("Something went wrong when trying to retrieve user ID:", error)
		}
	}

	dbConn.pool.query('SELECT * FROM users WHERE username = $1 OR email = $2',
		[username, email],
		(err, result) => {
			if (err)
				res.send('DuplicateCHECK ', err)
			if (result.rowCount > 0) {
				return res.send({ message: `Username / email already exists` })
			}
			else {
				bcrypt.hash(password, saltRounds, (err, hash) => {
					if (err)
						console.log('BCRYPT :', err);
					else {
						sendVerifyCode();
						var sql = `INSERT INTO users (username, firstname, lastname, email, password, verifycode) VALUES ($1, $2, $3, $4, $5, $6)`
						dbConn.pool.query(sql, [username, firstname, lastname, email, hash, verifycode],
							(err, result) => {
								if (err)
									console.log('INSERT________ERRRORRR: ', err);
								else {
									try {
										retrieveId(username)
											.then((id) => {
												console.log('rows[0].id', id)
												sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
												dbConn.pool.query(sql, [id, "localhost:3000/images/default_profilepic"])
												res.send({ message: `Registration email sent to '${email}'`, result });
											}).catch((error) => {
												return (error)
											})
									} catch (error) {
										console.error("Something went wrong when trying to create a default avatar for the user:", error)
									}
								}
							})
					}
				})
			}
		}
	)
})

router.get('/emailverify/:hashedverify', (req, res) => {
	const hashedverify = req.params.hashedverify;
	// console.log('HASHEDVERIFY===', hashedverify);

	dbConn.pool.query('SELECT * FROM users WHERE verifycode = $1',
		[hashedverify],
		(err, result) => {
			if (err) {
				res.send(err);
				console.log('VERIFYERR ', err);
			}
			if (result.rowCount > 0) {
				dbConn.pool.query('UPDATE users SET status = $1 WHERE verifycode = $2',
					[1, hashedverify])
				res.send('Email verification successfully.');
			}
			else {
				res.send('Email verification failed, link is invalid or something.');
			}
		})
})

module.exports = router