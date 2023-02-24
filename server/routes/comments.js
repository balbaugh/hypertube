const express = require('express');
const router = express.Router();

const dbConn = require('../utils/dbConnection');

// const getCommentsFromDatabase = (movieId, connection) => {
//    return new Promise((resolve, reject) => {
//        connection.query(`SELECT * FROM comments WHERE movie_id = $1`, [movieId], (error, results) => {
//            if (error) {
//                reject(error);
//            } else {
//                resolve(results.rows);
//            }
//        });
//    });
// };

// // Define the endpoint for getting comments
// router.get('/comments/:movieId', (req, res) => {
//    const movieId = req.params.movieId;

//    // Retrieve the comments for the specified movie ID from the database
//    dbConn.connectDB((err, connection) => {
//        if (err) {
//            console.log('error connecting to database', err);
//            res.status(500).json({ error: 'Error connecting to database' });
//        } else {
//            getCommentsFromDatabase(movieId, connection)
//                .then((comments) => {
//                    res.json(comments);
//                })
//                .catch((error) => {
//                    console.log('error retrieving comments', error);
//                    res.status(500).json({ error: 'Error retrieving comments' });
//                })
//                .finally(() => {
//                    connection.release();
//                });
//        }
//    });
// });

router.get('/comments/:movieId', (req, res) => {
    const movieId = req.params.movieId
    //console.log('huu', movieId)
    dbConn.pool.query(`SELECT *
                       FROM comments
                       WHERE movie_id = $1`,
        [movieId],
        (err, result) => {
            if (err)
                console.log('get comments err', err)
            else {
                res.send(result.rows)
            }
        })
})

router.post('/comments', (req, res) => {
    const newComment = req.body
    // Insert the new comment into the database
    dbConn.pool.query(`INSERT INTO comments (movie_id, user_id, text)
                       VALUES ($1, $2, $3)`,
        [newComment.movie_id, newComment.user_id, newComment.text],
        (err, result) => {
            if (err)
                console.log('adding comment', err)
            else {

            }
        })
});

router.get('/getCommentUser', (req, res) => {
    dbConn.pool.query(`SELECT *
                       FROM users`,
        (err, result) => {
            if (err)
                console.log('getting users', err)
            else {
                res.send(result.rows);
            }
        })
})

module.exports = router;
