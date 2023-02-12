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

// Signup and Logi stuff below

const register = (newObject) => {
	const req = axios.post(`${baseUrl}/register`, newObject);
	return (req.then(response => response.data));
}

const verifyemail = () => {
	const req = axios.get(`${baseUrl}/emailverify/:hashedverify`);
	return (req.then(response => response.data));
}

const login = (newObject) => {
	const req = axios.post(`${baseUrl}/login`, newObject);
	return (req.then(response => response.data));
}

const getCookie = () => {
	const req = axios.get(`${baseUrl}/login`);
	return (req.then(response => response.data));
}

const logout = () => {
	const req = axios.get(`${baseUrl}/logout`);
	return (req.then(response => response.data));
}

const forgot = (newObject) => {
  const req = axios.post(`${baseUrl}/forgot`, newObject);
  return req.then((response) => response.data)
}

const getForgot = (token) => {
  const req = axios.get(`${baseUrl}/get/${token}`)
  return req.then((response) => response.data)
}

const newPw = (newObject) => {
  const req = axios.put(`${baseUrl}/newPw`, newObject);
  return req.then((response) => response.data);
}

const getGitProfile = (codeParam) => {
	const req = axios.get(`${baseUrl}/github?codeParam=${codeParam}`);
	return req.then((response) => response.data)
}

const axiosStuff = {
	test, movieTest, toMovie, play, register, verifyemail, login,
	getCookie, logout, forgot, getForgot, newPw, getGitProfile
};

export default axiosStuff;
