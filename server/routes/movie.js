const express = require('express');
const dbConn = require('../utils/dbConnection');
const fs = require('fs')
// const cors = require('cors');
const app = express();
app.use(express.json())

const apiKey = '776a942cc891b770f717d032030c2e8d'

const router = express.Router();

router.get('/movie/:id', (req, res) => {
    const movieId = Number(req.params.id);
    fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`, {
        credentials: 'include',
    })
        .then((data) => {
            if (!data.ok) {
                return res.status(500).send({ error: `Error fetching movie details.` })
            }
            data.json().then((parsed) => {
                //const movie = parsed.data.movie;
                res.send({ parsed });
            })
        })
})

// addWatched
router.post('/watched', async (req, res) => {
    //console.log('req.body.movieId:', req.body.movieId)
    if (req.session.user) {
        const movieToWatched = req.body.movieId;

        await dbConn.pool.query(`SELECT *
                                FROM watched
                                WHERE user_id = $1
                                AND movie_id = $2`,
            [req.session.user.id, movieToWatched],
            (err, result) => {
                if (err)
                    console.log('getting watched err', err)
                else if (result.rowCount === 0) {
                    dbConn.pool.query(`INSERT INTO watched (user_id, movie_id)
                                        VALUES ($1, $2)`,
                        [req.session.user.id, movieToWatched],
                        (err2) => {
                            if (err2)
                                console.log('error adding watched movie')
                            else {
                                //console.log('Added to watched list.')
                                return res.send({ success: true })
                            }
                        })
                } else {
                    //console.log('Was already in watched list.')
                    return res.send({ success: false })
                }
            })
    } else {
        res.redirect('/');
    }
})

//getWatched
router.get('/watched', (req, res) => {
    if (req.session.user) {
        dbConn.pool.query(`SELECT *
                           FROM watched
                           WHERE user_id = $1`,
            [req.session.user.id],
            (err, result) => {
                if (err)
                    console.log('getting watched err', err)
                else {
                    res.send(result.rows)
                }
            })
    }
    else {
        res.send(false)
    }
})

// original getPoster
// router.get('/poster/:id', (req, res) => {
// 	const movieId = req.params.id;

// 	fetch(`https://api.themoviedb.org/3/find/${movieId}?api_key=${apiKey}&language=en-US&external_source=imdb_id`)
// 		.then(response => response.json())
// 		.then(data => {
// 			const movie = data.movie_results[0]; // assuming the first result is the correct movie
// 			const posterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
// 			res.send(posterUrl)
// 		})
// 		.catch(error => console.error(error));
// })

// modified getPoster
router.get('/poster/:id', (req, res) => {
    const movieId = req.params.id;

    fetch(`https://api.themoviedb.org/3/find/${movieId}?api_key=${apiKey}&language=en-US&external_source=imdb_id`)
        .then(response => response.json())
        .then(data => {
            // console.log('Data for movie:', data)
            try {
                if (data.movie_results.length === 0 || data === null || data.movie_results === null) {
                    //console.log('movie_results array was empty.')
                    const posterUrl = "http://localhost:3001/images/noImage.png"
                    res.send(posterUrl)
                } else {
                    const movie = data.movie_results[0]; // assuming the first result is the correct movie
                    // console.log('movie now:', movie)
                    if (movie === null || movie.poster_path === null) {
                        //console.log('NULLLL!!!!!!!!!!!!!!!!!!!!!!!!!')
                        //console.log('movie now:', movie)
                        const posterUrl = "http://localhost:3001/images/noImage.png"
                        res.send(posterUrl)
                    } else {
                        const posterUrl = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                        res.send(posterUrl)
                    }
                }
            } catch (error) {
                console.error('Movie poster retrieval error:', error)
            }
        })
        .catch(error => console.error(error));
})

module.exports = router
