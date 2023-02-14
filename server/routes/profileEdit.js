const config = require('../utils/config');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const dbConn = require('../utils/dbConnection');

router.get('/profileEdit', (req, res) => {
    if (req.session.user) {
        dbConn.pool.query('SELECT * FROM users WHERE id = $1',
            [req.session.user.id],
            (err, result) => {
                if (err)
                    console.log('edit', err);
                else {
                    res.send(result.rows[0]);
                }
            })
    }
    else {
        res.redirect('/');
    }
})

router.put('/profileEdit', (req, res) => {
    if (req.session.user) {
        const username = req.body.username;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;

        if (username.length < 4 || username.length > 20)
            return res.send({ message: `Username must be between 4 - 20 characters.` })
        if (!username.match(/^[a-zA-Z0-9_.!@-]+$/))
            return res.send({ message: 'Username can only have letters (a-z or A-Z), numbers (0-9) and some special characters (_.!#@-)' })
        // name checks
        if (!firstname.match(/^[a-zA-Z_.-]+$/))
            return res.send({ message: 'Firstname can only have letters (a-z or A-Z) and some special characters (_.-)' })
        if (firstname.length < 2 || firstname.length > 20)
            return res.send({ message: `Firstname must be between 1 - 20 characters.` })
        if (!lastname.match(/^[a-zA-Z_.-]+$/))
            return res.send({ message: 'Lastname can only have letters (a-z or A-Z) and some special characters (_.-)' })
        if (lastname.length < 2 || lastname.length > 20)
            return res.send({ message: `Lastname must be between 4 - 20 characters.` })

        // AND OTHER CHECKS!!!
        dbConn.pool.query('SELECT * FROM users WHERE username = $1 OR email = $2',
            [username, email],
            (err, result) => {
                if (err)
                    console.log('update', err);
                if (result.rowCount > 0 && result.rows[0].username !== req.session.user.username && result.rows[0].email !== req.session.user.email) {
                    // console.log('update duplicate', result);
                    return res.send({ message: `Username / email already exists`, result })
                }
                else {
                    dbConn.pool.query(`SELECT * FROM images WHERE user_id = $1`,
                        [req.session.user.id],
                        (err, result) => {
                            if (err)
                                console.log('userid from images err', err)
                            else {
                                if (result.rowCount > 0) {
                                    dbConn.pool.query(`UPDATE users SET username = $1, firstname = $2,
                                                lastname = $3, email = $4 WHERE user_id = $5`,
                                        [username, firstname, lastname, email, req.session.user.id],
                                        (err1, result1) => {
                                            if (err1)
                                                console.log('UPDATE PROFILE', err)
                                            else {
                                                res.send({ message: 'profile updated.', result, result1 })
                                            }
                                        })
                                }
                                else {
                                    dbConn.pool.query(`UPDATE profile SET username = $1, firstname = $2,
                                                lastname = $3, email = $4 WHERE user_id = $5`,
                                        [username, firstname, lastname, email, req.session.user.id],
                                        (err1, result1) => {
                                            if (err1)
                                                console.log('UPDATE PROFILE', err)
                                            else {
                                                res.send({ message: 'profile updated.', result, result1 })
                                            }
                                        })
                                }
                            }
                        })
                }
            })
    }
    else
        res.redirect('/');
})

module.exports = router