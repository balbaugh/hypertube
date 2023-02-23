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

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
let algo = 'sha256'

app.use(express.static('downloads'));
app.use('/images', express.static('./images'))
app.use(express.static('subtitles'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    key: 'userID',
    secret: 'BIGSECRET',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000 * 60 * 60 * 24,
        sameSite: 'Lax',
        //sameSite: 'none',
        //secure: true
    }
}))

const dbConn = require('./utils/dbConnection');
const {connectDB} = dbConn;
connectDB();

const middleware = require('./utils/middleware');
app.use(middleware.requestLogger);
app.use(middleware.morganLogger);

// const filePath = path.join(process.cwd(), 'subtitles', code, filename)

app.get('/', (req, res) => {
    res.sendStatus(200).end()
});

// const getCommentsFromDatabase = (movieId, connection) => {
// 	return new Promise((resolve, reject) => {
// 		connection.query(`SELECT * FROM comments WHERE movie_id = $1`, [movieId], (error, results) => {
// 			if (error) {
// 				reject(error);
// 			} else {
// 				resolve(results.rows);
// 			}
// 		});
// 	});
// };

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

const commentsRouter = require('./routes/comments');
app.use(commentsRouter);

app.use(middleware.unknowEndpoint);

app.listen(config.PORT, () => {
    console.log(`Server on port ${config.PORT}`)
})
