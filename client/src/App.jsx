import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Nav from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Homepage from './components/Homepage';
import Browse from './components/Browse';
import FilmDetail from './components/FilmDetail';
// import Player from "./components/Player";
import Registration from './components/Registration';
import RegForm from './components/RegForm';
import Login from './components/Login';
import Forgot from './components/Forgot';
import TestMovieThumb from './components/testmoviethumb';
import TheTest from './components/thetest';

import List from './components/List';
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

	axios.defaults.withCredentials = true;

	useEffect(() => {
		axiosStuff.getCookie().then((response) => {
			if (response.loggedIn === true) {
				setLoggedIn(true);
				setItsMe(response.user);
			}
		});
	}, [loggedIn]);

	useEffect(() => {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const codeParam = urlParams.get('code');
		console.log(codeParam);
		if (codeParam !== null)
			console.log('len', codeParam.length)

		if (codeParam && codeParam.length < 30) {
			axiosStuff
			.getGitProfile(codeParam)
			.then((response) => {
				console.log(response)
				setLoggedIn(true);
				setItsMe(response.user)
			})
		}
		else if (codeParam && codeParam.length >= 30) {
			axiosStuff
			.get42Profile(codeParam)
			.then((response) => {
				console.log('42', response)
				setLoggedIn(true);
				setItsMe(response.user)
			})
		}
	}, [])

	console.log('itsmee', itsMe)

  return (
    <div className="text-slate-300 h-full min-h-screen wrapper bg-gradient-to-t from-zinc-800 to-zinc-900">

			<Router>
				<Nav itsMe={itsMe} />
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/homepage" element={<Homepage />} />
					<Route path="/browse" element={<Browse />} />
					{/* <Route path='/film' element={<FilmDetail />} /> */}
					<Route path="/film/:id" element={<FilmDetail />} />
					{/* <Route path='/player' element={<Player />} /> */}
					{/* <Route path='/player/:id' element={<Player movieUrl={movieUrl} />} /> */}
					<Route path="/registration" element={<Registration />} />
					<Route path="/regform" element={<RegForm />} />
					<Route path="/login" element={<Login />} />
					<Route path="/forgot" element={<Forgot />} />
					<Route path="testmovie" element={<TestMovieThumb />} />
					<Route path="thetest/:id" element={<TheTest />} />
					<Route path="/list" element={<List />} />
					<Route path="/popular" element={<Popular />} />
					<Route path="/best-rating" element={<BestRating />} />
					<Route path="/newest" element={<Newest />} />
					<Route path="/year-new-old" element={<YearNewOld />} />
					<Route path="/year-old-new" element={<YearOldNew />} />
					<Route path="/logout" element={ <Logout loggedIn={loggedIn} setLoggedIn={setLoggedIn} /> } />
					<Route path="/get/:token" element={<Forgot2 />} />
					<Route path="*" element={<Landing />} />
				</Routes>
				<Footer />
			</Router>
		</div>
	);
};

export default App;
