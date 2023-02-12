import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
// import axiosStuff from "services/axiosstuff";

function useLogout(loggedIn, setLoggedIn) {
	axios.defaults.withCredentials = true; // For the sessions the work
	// console.log('eka', loggedIn)

	useEffect(() => {
		axios.get('http://localhost:3001/logout');
		// .then(() => {
		setLoggedIn(false);
		// })
		// console.log('toka', loggedIn)
		setTimeout(() => {
			window.location.replace('/');
		}, 2000);
	}, [setLoggedIn, loggedIn]);
}

function Logout({ loggedIn, setLoggedIn }) {
	useLogout(loggedIn, setLoggedIn);
	// return null;
	return <div>out.....</div>;
}

Logout.propTypes = {
	setLoggedIn: PropTypes.func.isRequired,
	loggedIn: PropTypes.bool.isRequired,
};

export default Logout;
