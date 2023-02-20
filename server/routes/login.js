const config = require('../utils/config');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
let algo = 'sha256'
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

	const retrieveId = async (randomUsername) => {
		try {
			var sql = "SELECT id FROM users WHERE username = $1;"
			var { rows } = await dbConn.pool.query(sql, [randomUsername])
			return (rows[0].id)
		} catch (error) {
			console.error("Something went wrong when trying to retrieve user ID:", error)
		}
	}

	const generateRandomUsername = async () => {
		while (true) {
			var randomUsername = crypto.randomBytes(20).toString('hex')
			var sql = 'SELECT * FROM users WHERE username = $1;'
			const result = await dbConn.pool.query(sql, [randomUsername])
			console.log('randomUsername:', randomUsername)
			console.log('result.rows:', result.rows)
			if (result.rows.length < 1) {
				console.log('No duplicates found for the newly generated random username in getlogin.')
				break
			} else {
				console.log('Found a duplicate for the newly generated random username in getlogin. Proceeding to generate a new random username.')
				continue
			}
		}
		return randomUsername
	}

	const fetchSessionInfo = async (id) => {
		try {
			const sql = `SELECT users.id, status, username, firstname, lastname, path FROM users
					INNER JOIN profile_pics
					ON users.id = profile_pics.user_id
					WHERE users.id = $1;`
			const result = await dbConn.pool.query(sql, [id])
			return (result.rows[0])
		} catch (error) {
			console.error(error)
		}
	}

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
					console.log('42 login data in server/index:', data)
					checkDelete()

					if (data?.login) {
						console.log('req.session.user.login in get 42:', data.login)
						console.log('req.session.user.id in get 42:', data.id)
						console.log('req.session.user.url in get 42:', data.url)

						const urlAsString = JSON.stringify(data.url);
						// We're checking if the user is logging in via the 42 OAuth or the GitHub OAuth.
						if (urlAsString.match(/api\.intra\.42/)) {
							console.log('String contained substring \'api.intra.42\'. Seems we\'re accessing the 42 OAuth API.')

							const fortytwo_id = data.id
							console.log('data.id', data.id)

							const checkIf42UserExists = async (fortytwo_id) => {
								const sql = 'SELECT * FROM users WHERE fortytwo_id = $1;'
								const result = await dbConn.pool.query(sql, [fortytwo_id])
								if (result.rows.length < 1) {
									console.log('OAuth user is not yet in the users table.')
									return false
								} else {
									console.log('OAuth user already exists in the users table.')
									return true
								}
							}

							const retrieveIdBy42Id = async (fortytwo_id) => {
								try {
									var sql = "SELECT id FROM users WHERE fortytwo_id = $1;"
									var { rows } = await dbConn.pool.query(sql, [fortytwo_id])
									return (rows[0].id)
								} catch (error) {
									console.error("Something went wrong when trying to retrieve user ID:", error)
								}
							}

							checkIf42UserExists(fortytwo_id)
								.then((bool) => {
									// If the user was not found in the table, we'll create a new user and log in as them. We'll set the avatar as the default profile picture.
									if (bool === false) {
										generateRandomUsername()
											.then((randomUsername) => {
												const verifycode = crypto.createHash(algo).update(randomUsername).digest('base64url');
												var sql = `INSERT INTO users (username, firstname, lastname, email, password, verifycode, fortytwo_id, status)
																		VALUES ($1, 	$2, 		$3, 	$4,		$5, 		$6,			$7,			$8)`
												dbConn.pool.query(sql, [randomUsername, "Not yet set", "Not yet set", "Not yet set", "None", verifycode, fortytwo_id, 1],
													(err, result) => {
														if (err)
															console.log('INSERT________ERRRORRR: ', err);
														else {
															retrieveId(randomUsername)
																.then((id) => {
																	console.log('rows[0].id', id)
																	sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
																	dbConn.pool.query(sql, [id, "http://localhost:3001/images/default_profilepic.jpg"],
																		(err, result) => {
																			if (err)
																				console.error("Something went wrong when trying to assign the default avatar to the user:", err)
																			else {
																				try {
																					fetchSessionInfo(id)
																						.then((response) => {
																							req.session.user = response
																							return res.send({
																								loggedIn: true,
																								user: req.session.user,
																								avatar: "http://localhost:3001/images/default_profilepic.jpg",
																								result
																							})
																						})
																				} catch (error) {
																					console.error("Something went wrong when trying to generate user session:", error)
																				}
																			}
																		})
																}).catch((error) => {
																	return (error)
																})
														}
													})
											})
										// If the user was found in the table, we'll log in as them, as an existing 42 user.
									} else {
										var sql = `SELECT users.id, status, username, firstname, lastname, path FROM users
													LEFT JOIN profile_pics
													ON users.id = profile_pics.user_id
													WHERE fortytwo_id = $1;`
										dbConn.pool.query(sql, [fortytwo_id],
											(err, result) => {
												if (err) {
													console.error('req.user.session', err);
												} else {
													req.session.user = result.rows[0]
													console.log('Logging in as an existing 42 user. result.rows[0]:', result.rows[0])
													if (result.rows[0]['path'] === undefined || result.rows[0]['path'] == null) {
														// If the user is missing a profile picture because someone deleted it in the database, let's assign them the default one again.
														try {
															retrieveIdBy42Id(fortytwo_id)
																.then((id) => {
																	sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
																	dbConn.pool.query(sql, [id, "http://localhost:3001/images/default_profilepic.jpg"])
																	res.send({ loggedIn: true, user: req.session.user, avatar: "http://localhost:3001/images/default_profilepic.jpg", result })
																}).catch(error => {
																	console.error(error)
																})
														} catch (error) {
															console.error(error)
														}
													} else {
														res.send({ loggedIn: true, user: req.session.user, avatar: result.rows[0]['path'], result });
													}
												}
											})
									}
								}).catch(error => {
									console.error(error)
								})
						} else {
							console.log('We\'re accessing the Github OAuth API.')

							const github_id = data.id;
							console.log('data.id', data.id)

							const checkIfGithubUserExists = async (github_id) => {
								var sql = 'SELECT * FROM users WHERE github_id = $1;'
								var result = await dbConn.pool.query(sql, [github_id])
								if (result.rows.length < 1) {
									console.log('OAuth user is not in the users table yet.')
									return false
								} else {
									console.log('OAuth user already exists in the users table.')
									return true
								}
							}

							const retrieveIdByGithubId = async (github_id) => {
								try {
									var sql = "SELECT id FROM users WHERE github_id = $1;"
									var { rows } = await dbConn.pool.query(sql, [github_id])
									return (rows[0].id)
								} catch (error) {
									console.error("Something went wrong when trying to retrieve user ID:", error)
								}
							}

							checkIfGithubUserExists(github_id)
								.then((bool) => {
									// If the user was not found in the table, we'll create a new user and log in as them. We'll set the avatar as the default profile picture.
									if (bool === false) {
										generateRandomUsername()
											.then((randomUsername) => {
												const verifycode = crypto.createHash(algo).update(randomUsername).digest('base64url');
												var sql = `INSERT INTO users (username, firstname, lastname, email, password, verifycode, github_id, status)
																		VALUES ($1, 	$2, 		$3, 	$4, 	$5, 		$6, 		$7, 		$8);`
												dbConn.pool.query(sql, [randomUsername, "Not yet set", "Not yet set", "Not yet set", "None", verifycode, github_id, 1],
													(err, result) => {
														if (err)
															console.error('INSERT________ERRRORRR:', err)
														else {
															retrieveId(randomUsername)
																.then((id) => {
																	console.log('rows[0].id', id)
																	sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
																	dbConn.pool.query(sql, [id, "http://localhost:3001/images/default_profilepic.jpg"],
																		(err, result) => {
																			if (err)
																				console.error("Something went wrong when trying to assign the default avatar to the user:", err)
																			else {
																				try {
																					fetchSessionInfo(id)
																						.then((response) => {
																							req.session.user = response
																							return res.send({
																								loggedIn: true,
																								user: req.session.user,
																								avatar: "http://localhost:3001/images/default_profilepic.jpg",
																								result
																							})
																						})
																				} catch (error) {
																					console.error("Something went wrong when trying to generate user session:", error)
																				}
																			}
																		})
																}).catch((error) => {
																	return (error)
																})
														}
													})
											})
										// If the user was found in the table, we'll log in as them, as an existing GitHub user.
									} else {
										var sql = `SELECT users.id, status, username, firstname, lastname, path FROM users
													LEFT JOIN profile_pics
													ON users.id = profile_pics.user_id
													WHERE github_id = $1;`
										dbConn.pool.query(sql, [github_id],
											(err, result) => {
												if (err) {
													console.error('req.user.session', err);
												} else {
													req.session.user = result.rows[0]
													console.log('Logging in as an existing Github user. result.rows[0]:', result.rows[0])
													if (result.rows[0]['path'] === undefined || result.rows[0]['path'] == null) {
														// If the user is missing a profile picture because someone deleted it in the database, let's assign them the default one again.
														try {
															retrieveIdByGithubId(github_id)
																.then((id) => {
																	sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
																	dbConn.pool.query(sql, [id, "http://localhost:3001/images/default_profilepic.jpg"])
																	res.send({ loggedIn: true, user: req.session.user, avatar: "http://localhost:3001/images/default_profilepic.jpg", result })
																}).catch(error => {
																	console.error(error)
																})
														} catch (error) {
															console.error(error)
														}
													} else {
														res.send({ loggedIn: true, user: req.session.user, avatar: result.rows[0]['path'], result });
													}
												}
											})
									}
								}).catch(error => {
									console.error(error)
								})

						}
					}
				}).catch(error => {
					console.error(error)
				})
		})
})

router.get('/github', (req, res) => {
	const code = req.query.codeParam;

	console.log('Made it here')
	const retrieveId = async (randomUsername) => {
		try {
			var sql = "SELECT id FROM users WHERE username = $1;"
			var { rows } = await dbConn.pool.query(sql, [randomUsername])
			return (rows[0].id)
		} catch (error) {
			console.error("Something went wrong when trying to retrieve user ID:", error)
		}
	}

	const generateRandomUsername = async () => {
		while (true) {
			var randomUsername = crypto.randomBytes(20).toString('hex')
			var sql = 'SELECT * FROM users WHERE username = $1;'
			const result = await dbConn.pool.query(sql, [randomUsername])
			console.log('randomUsername:', randomUsername)
			console.log('result.rows:', result.rows)
			if (result.rows.length < 1) {
				console.log('No duplicates found for the newly generated random username in getlogin.')
				break
			} else {
				console.log('Found a duplicate for the newly generated random username in getlogin. Proceeding to generate a new random username.')
				continue
			}
		}
		return randomUsername
	}

	const fetchSessionInfo = async (id) => {
		try {
			const sql = `SELECT users.id, status, username, firstname, lastname, path FROM users
					INNER JOIN profile_pics
					ON users.id = profile_pics.user_id
					WHERE users.id = $1;`
			const result = await dbConn.pool.query(sql, [id])
			return (result.rows[0])
		} catch (error) {
			console.error(error)
		}
	}

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
					console.log('github login data in server/index:', data)
					checkDelete()

					if (data?.login) {
						console.log('req.session.user.login in get github:', data.login)
						console.log('req.session.user.id in get github:', data.id)
						console.log('req.session.user.url in get github:', data.url)

						const urlAsString = JSON.stringify(data.url);
						// We're checking if the user is logging in via the 42 OAuth or the GitHub OAuth.
						if (urlAsString.match(/api\.intra\.42/)) {
							console.log('String contained substring \'api.intra.42\'. Seems we\'re accessing the 42 OAuth API.')

							const fortytwo_id = data.id
							console.log('data.id', data.id)

							const checkIf42UserExists = async (fortytwo_id) => {
								const sql = 'SELECT * FROM users WHERE fortytwo_id = $1;'
								const result = await dbConn.pool.query(sql, [fortytwo_id])
								if (result.rows.length < 1) {
									console.log('OAuth user is not yet in the users table.')
									return false
								} else {
									console.log('OAuth user already exists in the users table.')
									return true
								}
							}

							const retrieveIdBy42Id = async (fortytwo_id) => {
								try {
									var sql = "SELECT id FROM users WHERE fortytwo_id = $1;"
									var { rows } = await dbConn.pool.query(sql, [fortytwo_id])
									return (rows[0].id)
								} catch (error) {
									console.error("Something went wrong when trying to retrieve user ID:", error)
								}
							}

							checkIf42UserExists(fortytwo_id)
								.then((bool) => {
									// If the user was not found in the table, we'll create a new user and log in as them. We'll set the avatar as the default profile picture.
									if (bool === false) {
										generateRandomUsername()
											.then((randomUsername) => {
												const verifycode = crypto.createHash(algo).update(randomUsername).digest('base64url');
												var sql = `INSERT INTO users (username, firstname, lastname, email, password, verifycode, fortytwo_id, status)
																		VALUES ($1, 	$2, 		$3, 	$4,		$5, 		$6,			$7,			$8)`
												dbConn.pool.query(sql, [randomUsername, "Not yet set", "Not yet set", "Not yet set", "None", verifycode, fortytwo_id, 1],
													(err, result) => {
														if (err)
															console.log('INSERT________ERRRORRR: ', err);
														else {
															retrieveId(randomUsername)
																.then((id) => {
																	console.log('rows[0].id', id)
																	sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
																	dbConn.pool.query(sql, [id, "http://localhost:3001/images/default_profilepic.jpg"],
																		(err, result) => {
																			if (err)
																				console.error("Something went wrong when trying to assign the default avatar to the user:", err)
																			else {
																				try {
																					fetchSessionInfo(id)
																						.then((response) => {
																							req.session.user = response
																							return res.send({
																								loggedIn: true,
																								user: req.session.user,
																								avatar: "http://localhost:3001/images/default_profilepic.jpg",
																								result
																							})
																						})
																				} catch (error) {
																					console.error("Something went wrong when trying to generate user session:", error)
																				}
																			}
																		})
																}).catch((error) => {
																	return (error)
																})
														}
													})
											})
										// If the user was found in the table, we'll log in as them, as an existing 42 user.
									} else {
										var sql = `SELECT users.id, status, username, firstname, lastname, path FROM users
													LEFT JOIN profile_pics
													ON users.id = profile_pics.user_id
													WHERE fortytwo_id = $1;`
										dbConn.pool.query(sql, [fortytwo_id],
											(err, result) => {
												if (err) {
													console.error('req.user.session', err);
												} else {
													req.session.user = result.rows[0]
													console.log('Logging in as an existing 42 user. result.rows[0][path]', result.rows[0])
													if (result.rows[0]['path'] === undefined || result.rows[0]['path'] == null) {
														// If the user is missing a profile picture because someone deleted it in the database, let's assign them the default one again.
														try {
															retrieveIdBy42Id(fortytwo_id)
																.then((id) => {
																	sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
																	dbConn.pool.query(sql, [id, "http://localhost:3001/images/default_profilepic.jpg"])
																	res.send({ loggedIn: true, user: req.session.user, avatar: "http://localhost:3001/images/default_profilepic.jpg", result })
																}).catch(error => {
																	console.error(error)
																})
														} catch (error) {
															console.error(error)
														}
													} else {
														res.send({ loggedIn: true, user: req.session.user, avatar: "http://localhost:3001/images/default_profilepic.jpg", result })
													}
												}
											})
									}
								}).catch(error => {
									console.error(error)
								})
						} else {
							console.log('We\'re accessing the Github OAuth API.')

							const github_id = data.id;
							console.log('data.id', data.id)

							const checkIfGithubUserExists = async (github_id) => {
								var sql = 'SELECT * FROM users WHERE github_id = $1;'
								var result = await dbConn.pool.query(sql, [github_id])
								if (result.rows.length < 1) {
									console.log('OAuth user is not in the users table yet.')
									return false
								} else {
									console.log('OAuth user already exists in the users table.')
									return true
								}
							}

							const retrieveIdByGithubId = async (github_id) => {
								try {
									var sql = "SELECT id FROM users WHERE github_id = $1;"
									var { rows } = await dbConn.pool.query(sql, [github_id])
									return (rows[0].id)
								} catch (error) {
									console.error("Something went wrong when trying to retrieve user ID:", error)
								}
							}

							checkIfGithubUserExists(github_id)
								.then((bool) => {
									// If the user was not found in the table, we'll create a new user and log in as them. We'll set the avatar as the default profile picture.
									if (bool === false) {
										generateRandomUsername()
											.then((randomUsername) => {
												const verifycode = crypto.createHash(algo).update(randomUsername).digest('base64url');
												var sql = `INSERT INTO users (username, firstname, lastname, email, password, verifycode, github_id, status)
																		VALUES ($1, 	$2, 		$3, 	$4, 	$5, 		$6, 		$7, 		$8);`
												dbConn.pool.query(sql, [randomUsername, "Not yet set", "Not yet set", "Not yet set", "None", verifycode, github_id, 1],
													(err, result) => {
														if (err)
															console.error('INSERT________ERRRORRR:', err)
														else {
															retrieveId(randomUsername)
																.then((id) => {
																	console.log('rows[0].id', id)
																	sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
																	dbConn.pool.query(sql, [id, "http://localhost:3001/images/default_profilepic.jpg"],
																		(err, result) => {
																			if (err)
																				console.error("Something went wrong when trying to assign the default avatar to the user:", err)
																			else {
																				try {
																					fetchSessionInfo(id)
																						.then((response) => {
																							req.session.user = response
																							return res.send({
																								loggedIn: true,
																								user: req.session.user,
																								avatar: "http://localhost:3001/images/default_profilepic.jpg",
																								result
																							})
																						})
																				} catch (error) {
																					console.error("Something went wrong when trying to generate user session:", error)
																				}
																			}
																		})
																}).catch((error) => {
																	return (error)
																})
														}
													})
											})
										// If the user was found in the table, we'll log in as them, as an existing GitHub user.
									} else {
										var sql = `SELECT users.id, status, username, firstname, lastname, path FROM users
													LEFT JOIN profile_pics
													ON users.id = profile_pics.user_id
													WHERE github_id = $1;`
										dbConn.pool.query(sql, [github_id],
											(err, result) => {
												if (err) {
													console.error('req.user.session', err);
												} else {
													req.session.user = result.rows[0]
													console.log('Logging in as an existing Github user. result.rows[0]', result.rows[0])
													if (result.rows[0]['path'] === undefined || result.rows[0]['path'] == null) {
														// If the user is missing a profile picture because someone deleted it in the database, let's assign them the default one again.
														try {
															retrieveIdByGithubId(github_id)
																.then((id) => {
																	sql = "INSERT INTO profile_pics (user_id, path) VALUES ($1, $2)"
																	dbConn.pool.query(sql, [id, "http://localhost:3001/images/default_profilepic.jpg"])
																	res.send({ loggedIn: true, user: req.session.user, avatar: "http://localhost:3001/images/default_profilepic.jpg", result })
																}).catch(error => {
																	console.error(error)
																})
														} catch (error) {
															console.error(error)
														}
													} else {
														res.send({ loggedIn: true, user: req.session.user, avatar: result.rows[0]['path'], result })
													}
												}
											})
									}
								}).catch(error => {
									console.error(error)
								})

						}
					}
				}).catch(error => {
					console.error(error)
				})
		})
})

router.get('/login', (req, res) => {
	// console.log('req.session.user in getlogin:', req.session.user)

	if (req.session.user) {
		dbConn.pool.query(`SELECT users.id, status, username, firstname, lastname, path FROM users
							INNER JOIN profile_pics
							ON users.id = profile_pics.user_id
							WHERE users.id = $1;`,
			[req.session.user.id],
			(err, result) => {
				if (err) {
					console.error('req.user.session', err);
				} else {
					checkDelete();
					res.send({ loggedIn: true, user: req.session.user, avatar: result.rows[0]['path'], result });
				}
			})
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
			// console.log('result.rows[0] in postlogin:', result.rows[0])
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
	if (!pw.match(/(?=^.{8,20}$)(?=.*\d)(?=.*[_.!#@-]+)(?=.*[A-Z])(?=.*[a-z]).*$/)) {
		return ({
			message: `Please enter a password with a length between 8 and 30 characters, 
					at least one lowercase alphabetical character (a to z), 
					at least one uppercase alphabetical character (A to Z), 
					at least one numeric character (0 to 9), 
					and at least one special character (_.!#@-)`
		})
	}
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
	if (!pw.match(/(?=^.{8,20}$)(?=.*\d)(?=.*[_.!#@-]+)(?=.*[A-Z])(?=.*[a-z]).*$/)) {
		return ({
			message: `Please enter a password with a length between 8 and 30 characters, 
						at least one lowercase alphabetical character (a to z), 
						at least one uppercase alphabetical character (A to Z), 
						at least one numeric character (0 to 9), 
						and at least one special character (_.!#@-)`
		})
	}
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
