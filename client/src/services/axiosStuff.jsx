import axios from 'axios';

const baseUrl = 'http://localhost:3001';

const test = () => {
	const req = axios.get(`${baseUrl}/testdb`);
	return req.then((response) => response.data)
}

const movieTest = () => {
	const req = axios.get(`${baseUrl}/movies`);
	return req.then((response) => response.data);
}

const toMovie = (id) => {
	const req = axios.get(`${baseUrl}/movie/${id}`);
	return req.then((response) => response.data);
}

const play = (magnet) => {
	const req = axios.get(`${baseUrl}/play`, {
		params: { magnet }
	});
	return req.then((response) => response.data);
}

const axiosStuff = {
	test, movieTest, toMovie, play,
};

export default axiosStuff;