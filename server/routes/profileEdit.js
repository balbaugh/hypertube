const config = require('../utils/config');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const multer = require('multer')
const path = require('path')
const fs = require('fs')

const dbConn = require('../utils/dbConnection');

const storage = multer.diskStorage({
    destination: (request, file, callbackFunction) => {
        callbackFunction(null, 'images/')
    },
    filename: (request, file, callbackFunction) => {
        console.log('file: ', file)
        callbackFunction(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.get('/profileInfo', (req, res) => {
    console.log('req.session.user', req.session.user)
    if (req.session.user) {
        dbConn.pool.query(`SELECT * FROM users
							INNER JOIN profile_pics
							ON users.id = profile_pics.user_id
							WHERE users.id = $1;`,
            [req.session.user.id],
            (err, result) => {
                if (err)
                    console.log('edit', err);
                else {
                    console.log('Data brought from profileEdit:', result.rows[0])
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
        const id = req.session.user.id

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
        dbConn.pool.query('SELECT * FROM users WHERE username = $1 AND id != $2',
            [username, id],
            (err, result) => {
                if (err)
                    console.log('update', err);
                if (result.rowCount > 0 && result.rows[0].username !== req.session.user.username) {
                    // console.log('update duplicate', result);
                    return res.send({ message: `Username already exists`, result })
                }
                else {
                    dbConn.pool.query(`UPDATE users
                                        SET username = $1, firstname = $2, lastname = $3
                                        WHERE id = $4`,
                        [username, firstname, lastname, req.session.user.id],
                        (err1, result1) => {
                            if (err1)
                                console.log('UPDATE PROFILE error:', err)
                            else {
                                res.send({ message: 'Profile successfully updated!', result, result1 })
                            }
                        })
                }
            })
    } else
        res.redirect('/');
})

router.post('/setprofilepic', upload.single('file'), async (request, response) => {
    const session = request.session.user
    const picture = 'http://localhost:3001/images/' + request.file.filename
    if (session.id) {
        if (request.file.size > 5242880) {
            return response.send('The maximum size for uploaded images is 5 megabytes.')
        }
        try {
            var sql = `SELECT * FROM profile_pics WHERE user_id = $1;`
            const profilePic = await dbConn.pool.query(sql, [session.id])
            let oldImageData = profilePic.rows[0]['path']
            // path.resolve gets the absolute path of '../images'
            const oldImage = path.resolve(__dirname, '../images') + oldImageData.replace('http://localhost:3001/images', '')
            // fs.existsSync checks if the image already exists, so if there is already an image with same name
            // in the images folder
            // console.log('Set a new profile picture to replace the old one.')
            if (fs.existsSync(oldImage) && (profilePic.rows[0]['path'] !== "http://localhost:3001/images/default_profilepic.jpg")) {
                // If it is, we remove it with fs.unlink
                fs.unlink(oldImage, (error) => {
                    if (error) {
                        console.error('fs.unlink failed:', error)
                        return
                    }
                })
            }
            // We set the profile picture
            sql = `UPDATE profile_pics SET path = $1 WHERE user_id = $2;`
            await dbConn.pool.query(sql, [picture, session.id])
            console.log('Sending true from /setprofilepic!')
            response.send({ success: true, path: picture })
        } catch (error) {
            console.error(error)
            response.send({ message: `Something went wrong when trying to upload the image.` })
        }
    }
})

module.exports = router