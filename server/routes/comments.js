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
router.get('/comments/:movieId', (req, res) => {
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

router.post('/comments', (req, res) => {
    const { movieId, author, content } = req.body;
    console.log('body', req.body);

    // Insert the new comment into the database
    const query = `
    INSERT INTO comments (movie_id, user_id, content)
    VALUES ($1, $2, $3)
  `;
    dbConn.pool.query(query, [movieId, author, content], (error, result) => {
        if (error) {
            console.error('Error inserting comment', error);
            res.status(500).json({ error: 'Error inserting comment' });
        } else {
            res.json({ message: 'Comment added successfully' });
        }
    });
});


module.exports = router;
