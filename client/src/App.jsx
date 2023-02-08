import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Nav from './components/Navbar';
import Footer from './components/Footer';
import Landing from './components/Landing';
import Homepage from './components/Homepage';
import Browse from './components/Browse';
import FilmDetail from './components/FilmDetail';
import Player from "./components/Player";
import Registration from './components/Registration';
import RegForm from './components/RegForm';
import Login from './components/Login';
import Forgot from './components/Forgot';
import TestMovieThumb from './components/testmoviethumb';
import TheTest from './components/thetest';
import List from './components/List';

const App = () => {

	// useEffect(() => {
	//	axiosStuff
	//	.getLocationData()
	//	.then((response) => {
	//		console.log(response)
	//	})
	// }, [])

  return (
    <div className="text-slate-300 h-full min-h-screen wrapper bg-gradient-to-t from-zinc-800 to-zinc-900">
			<Router>
				<Nav />
				<Routes>
					<Route path='/landing' element={<Landing />} />
					<Route path='/homepage' element={<Homepage />} />
					<Route path='/browse' element={<Browse />} />
					{/*<Route path='/film' element={<FilmDetail />} />*/}
					<Route path='/film/:id' element={<FilmDetail />} />
					<Route path='/player' element={<Player />} />
					{/*<Route path='/player/:id' element={<Player movieUrl={movieUrl} />} />*/}
					<Route path='/registration' element={<Registration />} />
					<Route path='/regform' element={<RegForm />} />
					<Route path='/login' element={<Login />} />
					<Route path='/forgot' element={<Forgot />} />
					<Route path='testmovie' element={<TestMovieThumb />} />
					<Route path='thetest/:id' element={<TheTest />} />
					<Route path='list' element={<List />} />
				</Routes>
				<Footer />
			</Router>
    </div>
  );
}

export default App;
