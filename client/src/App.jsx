import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import axios from 'axios';

import Nav from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Homepage from './components/Homepage';
import FilmDetail from './components/FilmDetail';
import Registration from './components/Registration';
import Login from './components/Login';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import ProfileEdit from './components/ProfileEdit';
import ChangePassword from './components/ChangePassword';
import Forgot from './components/Forgot';
// import TestMovieThumb from './components/testmoviethumb';
// import TheTest from './components/thetest';

import Popular from './components/Popular';
import BestRating from './components/BestRating';
import Newest from './components/Newest';
import YearNewOld from './components/YearNewOld';
import YearOldNew from './components/YearOldNew';

import Logout from './components/logout';
import Forgot2 from './components/forgot2';
import { useEffect, useState } from 'react';
import axiosStuff from './services/axiosStuff';

const App = () => {
	const [itsMe, setItsMe] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);
	const [selectedAvatar, setSelectedAvatar] = useState('')

	axios.defaults.withCredentials = true;

	useEffect(() => {
		axiosStuff.getCookie().then((response) => {
			console.log('response.loggedIn', response.loggedIn)
			if (response.loggedIn === true) {
				setLoggedIn(true);
				console.log('response.user in App.js, data from get login:', response.user)
				setItsMe(response.user);
				setSelectedAvatar(response.avatar)
			}
		});
	}, [loggedIn]);

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const codeParam = urlParams.get('code');
		console.log('codeParam:', codeParam);
		if (codeParam !== null)
			console.log('codeParam.length:', codeParam.length)

		if (codeParam && codeParam.length < 30) {
			axiosStuff
				.getGitProfile(codeParam)
				.then((response) => {
					console.log('github response in App:', response)
					setLoggedIn(true);
					setSelectedAvatar(response.avatar)
					setItsMe(response.user)
				})
		}
		else if (codeParam && codeParam.length >= 30) {
			axiosStuff
				.get42Profile(codeParam)
				.then((response) => {
					console.log('42 response in App:', response)
					setLoggedIn(true);
					setSelectedAvatar(response.avatar)
					setItsMe(response.user)
				})
		}
	}, [])

	console.log('itsmee', itsMe)
	console.log('selectedAvatar', selectedAvatar)


	return (
	<I18nextProvider i18n={i18n}>
		<div className="h-full min-h-screen text-slate-300 wrapper bg-gradient-to-t from-zinc-800 to-zinc-900">

			<Router>
				<Nav itsMe={itsMe} setItsMe={setItsMe} selectedAvatar={selectedAvatar}/>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/homepage" element={loggedIn ? <Homepage /> : <Landing />} />
					<Route path="/changePassword" element={loggedIn ? <ChangePassword /> : <Landing />} />
					<Route path="/film/:id" element={loggedIn ? <FilmDetail itsMe={itsMe} /> : <Landing />} />
					<Route path="/registration" element={<Registration />} />
					<Route path="/login" element={<Login />} />
					<Route path="/forgot" element={<Forgot />} />
					{/* <Route path="testmovie" element={<TestMovieThumb />} />
					<Route path="thetest/:id" element={<TheTest />} /> */}
					<Route path="/popular" element={loggedIn ? <Popular /> : <Landing />} />
					<Route path="/profile" element={loggedIn ? <Profile setItsMe={setItsMe} itsMe={itsMe} selectedAvatar={selectedAvatar} setSelectedAvatar={setSelectedAvatar}/> : <Homepage />} />
					<Route path="/profile/:id" element={loggedIn ? <UserProfile /> : <Homepage />} />
					<Route path="/profileEdit" element={loggedIn ? <ProfileEdit /> : <Landing />} />
					<Route path="/best-rating" element={loggedIn ? <BestRating /> : <Landing />} />
					<Route path="/newest" element={loggedIn ? <Newest /> : <Landing />} />
					<Route path="/year-new-old" element={loggedIn ? <YearNewOld /> : <Landing />} />
					<Route path="/year-old-new" element={loggedIn ? <YearOldNew /> : <Landing />} />
					<Route path="/logout" element={<Logout loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
					<Route path="/get/:token" element={<Forgot2 />} />
					{/*<Route path="*" element={<Landing />} />*/}
				</Routes>
				<Footer />
			</Router>
		</div>
	</I18nextProvider>
	);
};

export default App;
