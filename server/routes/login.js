const config = require('../utils/config');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const dbConn = require('../utils/dbConnection');

const checkDelete = () => {
	dbConn.pool.query('SELECT * FROM movies', (err, result) => {
		if (err) {
			console.error('Error getting movie data from the database', err);
			return;
		}

		const movies = result.rows;

		// Filter out movies that are less than 30 days old
		const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
		const oldMovies = movies.filter((movie) => new Date(movie.date) < thirtyDaysAgo);

		// Delete the files for the remaining movies from the computer
		oldMovies.forEach((movie) => {
			const moviePath = `downloads/${movie.movie_path}`;
			const pathElements = moviePath.split('/');
			const movieDir = `${pathElements[0]}/${pathElements[1]}`
			// const encoded = encodeURIComponent(moviePath)
			console.log('MOVIIIEEE PATTHH', moviePath)
			console.log('MOVIIEEEE DIR', movieDir)

			 fs.rm(movieDir, {
				recursive: true
			}, (err) => {
				if (err) {
					console.error(`Error deleting movie file ${movieDir}`, err);
				} else {
					console.log(`Deleted movie file ${movieDir}`);
				}
			});
		});

		const oldMovieIds = oldMovies.map((movie) => movie.id);
		dbConn.pool.query('DELETE FROM movies WHERE id = ANY($1::int[])', [oldMovieIds], (err, result) => {
			if (err) {
				console.error('Error deleting old movies from the database', err);
			} else {
				console.log(`Deleted ${result.rowCount} old movies from the database`);
			}
		});
	});
}

router.get('/42', (req, res) => {
	const code = req.query.codeParam;

  fetch(`https://api.intra.42.fr/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${config.UID_42}:${config.SECRET_42}`).toString('base64')}`
    },
    body: `grant_type=authorization_code&client_id=${config.UID_42}&client_secret=${config.SECRET_42}&code=${code}&redirect_uri=http://localhost:3000/homepage`
  })
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    const accessToken = data.access_token;
    fetch(`https://api.intra.42.fr/v2/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      // console.log('ma', data)
			checkDelete()
      req.session.user = data;
      res.send({ loggedIn: true, user: req.session.user })
    })
  })
})

router.get('/github', (req, res) => {
	const code = req.query.codeParam;
	fetch(`https://github.com/login/oauth/access_token?client_id=${config.GITHUB_CLIENT_ID}&client_secret=${config.GITHUB_CLIENT_SECRET}&code=${code}`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json'
		}
	})
		.then((response) => {
			return response.json()
		})
		.then((data) => {
			const accessToken = data.access_token;
			fetch(`https://api.github.com/user`, {
				headers: {
					'Authorization': `Token ${accessToken}`
				}
			})
				.then((response) => {
					return response.json()
				})
				.then((data) => {
					checkDelete()
					req.session.user = data;
					res.send({ loggedIn: true, user: req.session.user })
				})
		})
})

router.get('/login', (req, res) => {
	if (req.session.user) {
		dbConn.pool.query(`SELECT users.id, status, username, firstname, lastname, password, path FROM users
							INNER JOIN profile_pics
							ON users.id = profile_pics.user_id
							WHERE username = $1;`,
			[req.session.user.username],
			(err, result) => {
				if (err)
					console.log('req.user.session', err);
				else {
					//res.send({ loggedIn: true, user: req.session.user, avatar: result.rows[0]['path'], result });
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
		return res.send({ message: `Username must be between 4 - 20 characters.` })
	if (!username.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Username can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
	//password checks
	if (password.length < 8 || password.length > 20)
		return res.send({ message: `Password must be between 8 - 20 characters.` })
	if (!password.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Password can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })

	dbConn.pool.query(`SELECT users.id, status, username, firstname, lastname, password, path FROM users
						INNER JOIN profile_pics
						ON users.id = profile_pics.user_id
						WHERE username = $1;`,
		[username],
		(err, result) => {
			if (err)
				console.log('Login', err);
			if (result.rowCount === 1) {
				bcrypt.compare(password, result.rows[0].password, (error, response) => {
					if (response) {
						if (result.rows[0].status === 0) {
							return res.send({ message: 'Verify your email thanks.' });
						}
						req.session.user = result.rows[0];
						res.send({ result, message: `Logged in as '${username}' ` });
					}
					else
						return res.send({ message: `Wrong username / password combo.` });
				})
			}
			else {
				return res.send({ message: 'User doesn\'t exist.' });
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

router.post('/forgot', (req, res) => {
	const email = req.body.fEmail;

	dbConn.pool.query(`SELECT * FROM users WHERE email = $1`,
		[email],
		(err, result) => {
			if (err)
				console.log('getting email err', err);
			else {
				if (result.rowCount === 1) {

					const sendVerif = () => {
						const verif = result.rows[0].verifycode
						const mail = {
							from: config.EMAIL,
							to: email,
							subject: `Link for changing password.`,
							html: `
						<h1>Click me!</h1> <br />
						<a href='http://localhost:3000/get/${verif}'>ME</a>
					`
						}

						var transporter = nodemailer.createTransport({
							service: 'outlook',
							auth: {
								user: config.EMAIL,
								pass: config.EMAIL_PASSWORD
							}
						})

						transporter.sendMail(mail, (err) => {
							if (err)
								console.log('forgot err', err)
						})
					}

					sendVerif();
					res.send({ result, message: `Link sent to '${email}'.` })
				}
				else {
					res.send({ result, message: `no such email.` })
				}
			}
		})
})

router.get('/get/:token', (req, res) => {
	const token = String(req.params.token);
	dbConn.pool.query(`SELECT * FROM users WHERE verifycode = $1`,
		[token],
		(err, result) => {
			if (err)
				console.log('token err', err);
			else {
				res.send(result);
			}
		})
})

router.put('/newPw', (req, res) => {
	const pw = req.body.password;
	const cPw = req.body.confPasswd;
	const username = req.body.user;

	if (pw.length < 8 || pw.length > 20)
		return res.send({ message: `Password must be between 8 - 20 characters.` })
	if (!pw.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Password can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
	if (cPw.length < 8 || cPw.length > 20)
		return res.send({ message: `Password must be between 8 - 20 characters.` })
	if (!cPw.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Password can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
	if (pw !== cPw)
		return (res.send({ message: 'Passwords don\'t match.' }))

	bcrypt.hash(pw, 10, (err, hash) => {
		if (err)
			console.log('update pw hash error', err);
		else {
			dbConn.pool.query(`UPDATE users SET password = $1 WHERE username = $2`,
				[hash, username],
				(err1, result1) => {
					if (err1)
						console.log('update pw err', err1);
					else {
						res.send({ result1, message: `Password changed!` })
					}
				})
		}
	})
})

router.put('/changePw', (req, res) => {
	const pw = req.body.password;
	const cPw = req.body.confPasswd;
	const username = req.body.user;

	if (pw.length < 8 || pw.length > 20)
		return res.send({ message: `Password must be between 8 - 20 characters.` })
	if (!pw.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Password can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
	if (cPw.length < 8 || cPw.length > 20)
		return res.send({ message: `Password must be between 8 - 20 characters.` })
	if (!cPw.match(/^[a-zA-Z0-9_.!@-]+$/))
		return res.send({ message: 'Password can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
	if (pw !== cPw)
		return (res.send({ message: 'Passwords don\'t match.' }))

	bcrypt.hash(pw, 10, (err, hash) => {
		if (err)
			console.log('update pw hash error', err);
		else {
			dbConn.pool.query(`UPDATE users SET password = $1 WHERE username = $2`,
				[hash, username],
				(err1, result1) => {
					if (err1)
						console.log('update pw err', err1);
					else {
						res.send({ result1, message: `Password was successfully changed!` })
					}
				})
		}
	})
})

module.exports = router
