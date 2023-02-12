const express = require('express');
const cors = require('cors');
const torrentStream = require('torrent-stream');

// Session stuff
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const crypto = require('crypto')
const bcrypt = require('bcryptjs');
const config = require('./utils/config');

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
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
    sameSite: 'Lax',
	}
}));

const dbConn = require('./utils/dbConnection');

const { connectDB } = dbConn;
connectDB();

const middleware = require('./utils/middleware');

app.use(middleware.requestLogger);
app.use(middleware.morganLogger);

app.get('/', (req, res) => {
  res.sendStatus(200).end();
});

app.get('/testdb', (req, res) => {
  dbConn.pool.query(
'SELECT * FROM users',
    (err, result) => {
      if (err) {console.log(err)};
      else {
        res.send(result);
      }
    }
);
});

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
  console.log(`Server on port ${config.PORT}`);
});
