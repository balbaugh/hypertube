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
const apiKey = '776a942cc891b770f717d032030c2e8d'

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
			const movie = parsed.data.movie;
			res.send({ parsed });
		})
	})
 })

router.post('/watched', (req, res) => {
	if (req.session.user) {
		const movieToWatched = req.body.movieId;
		dbConn.pool.query(`SELECT * FROM watched WHERE user_id = $1 AND movie_id = $2`,
		[req.session.user.id, movieToWatched],
		(err, result) => {
			if (err)
				console.log('getting watched err', err)
			else if (result.rowCount === 0) {
				dbConn.pool.query(`INSERT INTO watched (user_id, movie_id) VALUES ($1, $2)`,
				[req.session.user.id, movieToWatched],
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

router.get('/poster/:id', (req, res) => {
	const movieId = req.params.id;

	fetch(`https://api.themoviedb.org/3/find/${movieId}?api_key=${apiKey}&language=en-US&external_source=imdb_id`)
  .then(response => response.json())
  .then(data => {
    const movie = data.movie_results[0]; // assuming the first result is the correct movie
    const posterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    res.send(posterUrl)
  })
  .catch(error => console.error(error));


})

module.exports = router
