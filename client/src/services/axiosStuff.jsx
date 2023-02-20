import axios from 'axios';

const baseUrl = 'http://localhost:3001';

// const test = () => {
//	const req = axios.get(`${baseUrl}/testdb`);
//	return req.then((response) => response.data)
// }

const movieTest = () => {
	const req = axios.get(`${baseUrl}/movies`);
	return req.then((response) => response.data);
}

const toMovie = (id) => {
	const req = axios.get(`${baseUrl}/movie/${id}`);
	return req.then((response) => response.data);
}

const subtitles = (code) => {
	const req = axios.get(`${baseUrl}/subtitles`,{
		params: { code }
	});
	return req.then((response) => response.data);
}

 const getSubs = (code) => {
	const req = axios.get(`${baseUrl}/getSubs`, {
		params: { code }
	});
	return req.then((response) => response.data);
 }
//const getSubs = (code) => {
//	const req = axios.get(`${baseUrl}/subtitles/${code}`)
//	return req.then((response) => response.data)
//}

const play = (magnet) => {
	const req = axios.get(`${baseUrl}/play`, {
		params: { magnet }
	});
	return req.then((response) => response.data);
}

const ready = () => {
	const req = axios.get(`${baseUrl}/ready`);
	return (req.then((response) => response.data))
}

const stream = () => {
	const req = axios.get(`${baseUrl}/stream`);
	return (req.then((response) => response.data))
}

// Signup and Login stuff below

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

const changePw = (newObject) => {
	const req = axios.put(`${baseUrl}/changePw`, newObject);
	return req.then((response) => response.data);
}

const getGitProfile = (codeParam) => {
	const req = axios.get(`${baseUrl}/github?codeParam=${codeParam}`);
	return req.then((response) => response.data)
}

const get42Profile = (codeParam) => {
	const req = axios.get(`${baseUrl}/42?codeParam=${codeParam}`);
	return req.then((response) => response.data);
}

const profileInfo = () => {
	const req = axios.get(`${baseUrl}/profileInfo`);
	return req.then((response) => response.data)
}

const getUserProfileInfo = (user_id) => {
	const req = axios.get(`${baseUrl}/profileInfo/${user_id}`);
	return req.then((response) => response.data)
}

const updateProfile = (newObject) => {
	const req = axios.put(`${baseUrl}/profileEdit`, newObject);
	return req.then((response) => response.data);
}

const getComments = (id) => {
	const req = axios.get(`${baseUrl}/comments/${id}`);
	return req.then((response) => response.data);
}

const submitComment = (newObject) => {
	const req = axios.post(`${baseUrl}/comments`, newObject);
	return req.then((response) => response.data);
}

const getCommentUser = () => {
	const req = axios.get(`${baseUrl}/getCommentUser`);
	return req.then((response) => response.data)
}

const setProfilePic = (Picture) => {
	const request = axios.post(`${baseUrl}/setprofilepic`, Picture)
	return request.then(response => response.data)
}

const axiosStuff = {
	// test,
	movieTest, toMovie, play, register, verifyemail, login,
	getCookie, logout, forgot, getForgot, newPw, getGitProfile, get42Profile,
	profileInfo, getUserProfileInfo, updateProfile, setProfilePic,
	changePw, ready, stream, getComments, submitComment,
	subtitles, getCommentUser, getSubs
};

export default axiosStuff;
