const express = require('express');
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
	fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`)
	.then((data) => {
		if (!data.ok) {
			return res.status(500).send({ error: `Error fetching movie details.`})
		}
		data.json().then((parsed) => {
			res.send({ parsed });
		})
	})
 })

module.exports = router
