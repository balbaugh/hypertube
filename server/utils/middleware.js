const morgan = require('morgan');

const requestLogger = (req, res, next) => {
	console.log('Method:', req.method);
	console.log('Path: ', req.path);
	console.log('Body: ', req.body);
	console.log('---'),
	next();
}

const morganLogger = morgan('dev', function (tokens, req, res) {
	return [
		tokens.method(req, res),
		tokens.url(req, res),
		tokens.status(req, res),
		tokens.res(req, res, 'content-length'), '-',
		tokens['response-time'](req, res), 'ms',
		JSON.stringify(req.body)
	].join(' ')
})
// const morganLogger = morgan('dev');

const unknowEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
}

module.exports = {
	requestLogger,
	morganLogger,
	unknowEndpoint,
}