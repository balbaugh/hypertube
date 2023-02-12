const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
const torrentStream = require('torrent-stream');
const passport = require('passport');

// Session stuff
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const crypto = require('crypto')
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors({
	origin: ['http://localhost:3000'],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true
}));

app.use(express.static('downloads'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	key: 'userID',
	secret: 'BIGSECRET',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 1000 * 60 * 60 * 24,
		sameSite: 'Lax'
	}
}))
app.use(passport.initialize());
app.use(passport.session());

const dbConn = require('./utils/dbConnection');
const { connectDB } = dbConn;
connectDB();

const middleware = require('./utils/middleware');
app.use(middleware.requestLogger);
app.use(middleware.morganLogger);

app.get('/', (req, res) => {
	res.sendStatus(200).end()
});

app.get('/testdb', (req, res) => {
	dbConn.pool.query('SELECT * FROM users',
		(err, result) => {
			if (err)
				console.log(err)
			else {
				res.send(result)
			}
		})
})

const GITHUB_CLIENT_ID = 'dc9f41e6c78388a47b7c';
const GITHUB_CLIENT_SECRET = '554c1d6b03944844c00313062954a8a8cac487b9';
const GitHubStrategy = require('passport-github2').Strategy;

app.get('/github', (req, res) => {
	const code = req.query.codeParam;
	fetch(`https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}&code=${code}`, {
		method: 'POST',
		headers: {
			'Accept': 'application/json'
		}
	})
	.then((response) => {
		return response.json()
	})
	.then((data) => {
		const accessToken = data.access_token;
		fetch(`https://api.github.com/user`, {
			headers: {
				'Authorization': `Token ${accessToken}`
			}
		})
		.then((response) => {
			return response.json()
		})
		.then((data) => {
			console.log('ma', data)
			req.session.user = data;
			res.send({ loggedIn: true, user: req.session.user })
		})
	})
})


const movies = require('./routes/movie');
app.use(movies);

const video = require('./routes/video');
app.use(video);

const reg = require('./routes/register');
app.use(reg);

const login = require('./routes/login');
app.use(login);

app.use(middleware.unknowEndpoint);

app.listen(config.PORT, () => {
	console.log(`Server on port ${config.PORT}`)
})
