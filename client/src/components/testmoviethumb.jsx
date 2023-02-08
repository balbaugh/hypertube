import { useEffect, useState } from "react"
import axiosStuff from "../services/axiosStuff";
import Loader from "./Loader";


const TestMovieThumb = () => {
	const [movies, setMovies] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axiosStuff
		.movieTest()
		.then((response) => {
			console.log(response.parsed)
			setMovies(response.parsed.data.movies)
		}).then(() => {
			setLoading(false);
		})
	}, []);

	 const toMovie = (movies) => {
		const id = movies.id;
		console.log('movieid', id)
		axiosStuff
		.toMovie(id).then(() => {
			window.location.replace(`/thetest/${id}`);
		})
	 }


	return (
		<div className="h-auto min-h-screen mx-auto">
			{loading ? (
				<div className="py-20">
					<Loader/>
				</div>
			) : (
				movies.map(movies =>
					<div className="m-auto text-center" key={movies.id}>
					<button type="button"
					// onClick={toMovie}
					onClick={() => toMovie(movies)}
					>
						huhuu
						<div className="w-3/4 m-auto text-center">
							<img className="m-auto min-w-[25%]"
								src={movies.medium_cover_image}
								alt={movies.title}
							/>
							<div>
								<p>Title: {movies.title}</p>
								<p>Production year: {movies.year}</p>
								<p>IMDb rating: {movies.rating}</p>
							</div>
						</div>
					</button>
				</div>
					)

			)}
		</div>
	)
}

export default TestMovieThumb;
