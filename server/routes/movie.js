const express = require('express');
const dbConn = require('../utils/dbConnection');
// const cors = require('cors');
const app = express();
app.use(express.json())
// app.use(cors({
//	origin: ['http://localhost:3000'],
//	methods: ['GET', 'POST', 'PUT', 'DELETE'],
//	credentials: true
// }));

const router = express.Router();

 router.get('/movies', (req, res) => {
	fetch('https://yts.mx/api/v2/list_movies.json')
	.then((data) => {
		data.json().then((parsed) => {
			res.send({ parsed })
		})
	})
 })

 router.get('/movie/:id', (req, res) => {
	const movieId = Number(req.params.id);
	fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`, {
		credentials: 'include',
	})
	.then((data) => {
		if (!data.ok) {
			return res.status(500).send({ error: `Error fetching movie details.`})
		}
		data.json().then((parsed) => {
			res.send({ parsed });
		})
	})
 })

router.post('/watched', (req, res) => {
	if (req.session.user) {
		const movieToWached = req.body.movieId;
		dbConn.pool.query(`SELECT * FROM watched WHERE user_id = $1 AND movie_id = $2`,
		[req.session.user.id, movieToWached],
		(err, result) => {
			if (err)
				console.log('getting watched err', err)
			else if (result.rowCount === 0) {
				dbConn.pool.query(`INSERT INTO watched (user_id, movie_id) VALUES ($1, $2)`,
				[req.session.user.id, movieToWached],
				(err2, result2) => {
					if (err2)
						console.log('error adding watched movie')
				})
			}
		})
	}
	else {
		res.redirect('/');
	}
})

router.get('/watched', (req, res) => {
	if (req.session.user) {
		dbConn.pool.query(`SELECT * FROM watched WHERE user_id = $1`,
		[req.session.user.id],
		(err, result) => {
			if (err)
				console.log('getting watched err', err)
			else {
				res.send(result.rows)
			}
		})
	}
})

module.exports = router
