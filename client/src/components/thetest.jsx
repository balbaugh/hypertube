import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import ReactPlayer from 'react-player';
import { Button } from 'flowbite-react'
import axiosStuff from "../services/axiosStuff";

import Loader from "./Loader";


const TheTest = () => {
	const { id } = useParams();
	const [movies, setMovies] = useState(id);
	const [loading, setLoading] = useState(true);
	const [watch, setWatch] = useState(false);
	const [playMovie, setPlayMovie] = useState('');

	useEffect(() => {
		axiosStuff
		.toMovie(id)
		.then((response) => {
			setMovies(response.parsed.data.movie)
		}).then(() => {
			if (movies.id === 0) {
				window.location.replace('/');
			}
			else {
				setLoading(false);
			}
		})
	}, [id, movies.id])

	console.log('leffa', movies)

	const startMovie = () => {
		const movieHash = movies.torrents[0].hash;
		const title = movies.title
		const encodedTitle = encodeURIComponent(title);
		const magnetUrl = `magnet:?xt=urn:btih:${movieHash}&dn=${encodedTitle}`

		setWatch(true);

		axiosStuff
		.play({title, magnetUrl})
		 .then((response) => {
			console.log('hii', response)
			setPlayMovie(`http://localhost:3001/${encodedTitle}/${response.movie_path.replace(/ /g, '%20')}`);
			// setPlayMovie(true)
		 })
	}


	if (playMovie)
		console.log('backrespoPLAYMOVIE', playMovie)


	return (
		<div className="h-auto min-h-screen mx-auto">
			{loading ? (
				<div className="py-20">
					<Loader/>
				</div>
			) : (
			<div className="m-auto text-center">
				PYORIIKO JO
				<div className="w-3/4 m-auto text-center">
					<img className="m-auto min-w-[25%]"
						src={movies.medium_cover_image}
						alt={movies.title}
					/>
  				<div>
  				  <Button className='m-auto'
							onClick={startMovie}
						>
  				    watch movie
  				  </Button>
  				</div>
					{watch ? (
					<div>
						{playMovie ? (
							<ReactPlayer
								url={playMovie}
								// url={`http://localhost:3001/Occupation:%20Native/Occupation%20Native%20(2017)%20%5B720p%5D%20%5BWEBRip%5D%20%5BYTS.MX%5D/Occupation.Native.2017.720p.WEBRip.x264.AAC-[YTS.MX].mp4`}
								playing={true}
								controls={true}
							/>
						) : (
							<div className="py-20">
								<Loader/>
							</div>
						)}
					</div>
					 ) : (null)}
					<div>
						<p>Title: {movies.title}</p>
						<p>Summary: {movies.description_full}</p>
						<p>Casting: </p>
						{movies.cast ? (
							<div>
							{movies.cast.map((cast, index) => (
								<div key={index}>
									<img src={cast.url_small_image} alt={cast.name} />
									<p>{cast.name} as {cast.character_name}</p>
								</div>
							))}
							</div>
						) : (null)}

						<p>Production year: {movies.year}</p>
						<p>Length: {movies.runtime} min</p>
						<p>IMDb rating: {movies.rating}</p>
					</div>
				</div>
			</div>
			)}
		</div>
	)
}

export default TheTest;
