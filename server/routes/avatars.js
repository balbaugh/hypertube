require('dotenv').config();
const config = require('../src/config/config');
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
// Session stuff
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// images
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
	user: config.pgUser,
	host: config.pgHost,
	database: config.pgDatabase,
	password: config.pgPassword,
	port: config.pgPort,
});

const app = express();
app.use(express.json());

app.use(express.static('public'))


app.use(cors({
	origin: ['http://localhost:3000'],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true,
}));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	session({
		key: 'userID',
		secret: 'BIGSECRET',
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 1000 * 60 * 60 * 24,
		},
	})
);

const router = express.Router();

router.use(express.static('public'))

router.get('/images2', (req, res) => {
	pool.query(`SELECT * FROM images`,
		(err, result) => {
			if (err)
				console.log('get images err', err)
			else {
				res.send(result)
			}
		})
});

router.get('/avatar2', (req, res) => {
	pool.connect();
	try {
		pool.query(
			'SELECT * FROM images WHERE user_id = $1 and avatar = true',
			[req.session.user.id],
			(err, result) => {
				if (err) console.log('avatar', err);
				else {
					let avatar = result.rows[0];
					res.send(avatar.path);
				}
			}
		);
	} catch (err) {
		console.log(err);
	}
});

// DELETE IMAGE
router.delete('/fakeimages2', (req, res) => {
	const del = req.body.delete1.delete1
	pool.query(`DELETE FROM images WHERE id = $1`,
		[del],
		(err, result) => {
			if (err)
				console.log('IMG DEL err', err)
			else {
				// console.log('IMGDEL', result.rowCount)
				res.send(result);
			}
		})
})

router.put('/images/user/:userId/:id', (req, res) => {
	const { id } = req.params;
	const { userId } = req.body;

	pool.query(
		`UPDATE images SET avatar=TRUE WHERE id=$1 AND user_id = $2`,
		[id, req.params.userId],
		(err, result) => {
			if (err) {
				console.log(err);
				res.status(500).send(
					'Error updating main photo status in the database'
				);
			} else {
				pool.query(
					`UPDATE images SET avatar=FALSE WHERE user_id = $1 AND id != $2`,
					[req.params.userId, id],
					(err, result) => {
						if (err) {
							console.log(err);
							res.status(500).send(
								'Error updating other main photo status in the database'
							);
						} else {
							res.status(200).send(
								'Main photo status updated successfully'
							);
						}
					}
				);
			}
		}
	);
});

// IMAGE UPLOAD
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log(req.session);
		const user = req.session.user;
		const userDir = path.join(__dirname, 'public', 'upload', `${user.id}`);
		if (!fs.existsSync(userDir)) {
			fs.mkdirSync(userDir);
		}
		cb(null, userDir);
	},
	filename: (req, file, cb) => {
		console.log(req.session);
		const { user } = req.session;
		const date = new Date().toISOString().split('T')[0];
		const match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
		const year = match[1];
		const month = match[2];
		const day = match[3];
		const formattedDate = `${day}-${month}-${year}`;
		console.log(formattedDate); // Outputs something like "02-01-2022"
		const uniqueString = crypto.randomBytes(2).toString('hex');

		cb(
			null,
			`user-${user.id}-date-${formattedDate}-${uniqueString}.${file.mimetype.split('/')[1]
			}`
		);
	},
});

module.exports = router;
