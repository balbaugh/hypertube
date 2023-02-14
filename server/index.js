const config = require('./utils/config');
const express = require('express');
const cors = require('cors');

// Session stuff
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

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

// const UID_42 = 'u-s4t2ud-faaf276d86ee3fc2e9ce4eb0498f051d356bf43b5c85848feb0eddd31f9a18e0';
// const SECRET_42 = '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'

app.get('/42', (req, res) => {
  const code = req.query.codeParam;

  fetch(`https://api.intra.42.fr/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${config.UID_42}:${config.SECRET_42}`).toString('base64')}`
    },
    body: `grant_type=authorization_code&client_id=${config.UID_42}&client_secret=${config.SECRET_42}&code=${code}&redirect_uri=http://localhost:3000/homepage`
  })
  .then((response) => {
    return response.json()
  })
  .then((data) => {
    const accessToken = data.access_token;
    fetch(`https://api.intra.42.fr/v2/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
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

// const GITHUB_CLIENT_ID = 'dc9f41e6c78388a47b7c';
// const GITHUB_CLIENT_SECRET = '554c1d6b03944844c00313062954a8a8cac487b9';

app.get('/github', (req, res) => {
	const code = req.query.codeParam;
	fetch(`https://github.com/login/oauth/access_token?client_id=${config.GITHUB_CLIENT_ID}&client_secret=${config.GITHUB_CLIENT_SECRET}&code=${code}`, {
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

const profileEdit = require('./routes/profileEdit');
app.use(profileEdit);

app.use(middleware.unknowEndpoint);

app.listen(config.PORT, () => {
	console.log(`Server on port ${config.PORT}`)
})
