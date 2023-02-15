const express = require('express');
const router = express.Router();

const dbConn = require('../utils/dbConnection');

const getCommentsFromDatabase = (movieId, connection) => {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM comments WHERE movie_id = $1`, [movieId], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.rows);
            }
        });
    });
};

// Define the endpoint for getting comments
router.get('/comments/:id', (req, res) => {
    const movieId = req.params.movieId;

    // Retrieve the comments for the specified movie ID from the database
    dbConn.connectDB((err, connection) => {
        if (err) {
            console.log('error connecting to database', err);
            res.status(500).json({ error: 'Error connecting to database' });
        } else {
            getCommentsFromDatabase(movieId, connection)
                .then((comments) => {
                    res.json(comments);
                })
                .catch((error) => {
                    console.log('error retrieving comments', error);
                    res.status(500).json({ error: 'Error retrieving comments' });
                })
                .finally(() => {
                    connection.release();
                });
        }
    });
});

module.exports = router;
