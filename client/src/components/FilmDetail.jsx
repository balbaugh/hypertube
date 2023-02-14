import React, { Fragment, useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import ReactPlayer from 'react-player'
import { Dialog, Disclosure, Transition} from '@headlessui/react'
import {StarIcon} from '@heroicons/react/20/solid'
import {HeartIcon, MinusIcon, PlusIcon} from '@heroicons/react/24/outline'
import axiosStuff from "../services/axiosStuff";
import Loader from "./Loader";

// interface Subtitles {
//     kind: string;
//     label: string;
//     src: string;
//     srcLang: string;
// }

const reviews = {
    average: 4,
    totalCount: 1624,
    counts: [
        {rating: 5, count: 1019},
        {rating: 4, count: 162},
        {rating: 3, count: 97},
        {rating: 2, count: 199},
        {rating: 1, count: 147},
    ],
    featured: [
        {
            id: 1,
            rating: 5,
            content: `
        <p>This film is one of the greats. If you haven't seen it before, stop everything and watch it now!!!</p>
      `,
            author: 'Emily Selman',
            avatarSrc:
                'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
        },
        // More reviews...
    ],
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const FilmDetail = () => {
    const {id} = useParams();
    const [movies, setMovies] = useState(id);
    const [loading, setLoading] = useState(true);
    const [watch, setWatch] = useState(false);
    const [playMovie, setPlayMovie] = useState('');
    const [open, setOpen] = useState(true)
    const playerRef = useRef(null);

		console.log('playerrf', playerRef)

    const onError = useCallback(() => {
        if (playerRef.current !== null) {
            playerRef.current.seekTo(0, 'seconds');
        }
    }, [playerRef])

    useEffect(() => {
        axiosStuff
            .toMovie(id)
            .then((response) => {
                setMovies(response.parsed.data.movie)
            }).then(() => {
            if (movies.id === 0) {
                window.location.replace('/');
            } else {
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
			const imdbCode = movies.imdb_code;

			// setOpen(!open)
			setWatch(true);

			axiosStuff
			.play({title, magnetUrl, imdbCode})
			 .then((response) => {
				console.log('hii', response)
				if (response.downloaded) {
					 setPlayMovie(`http://localhost:3001/ready`)
				}
				else {
					setPlayMovie(`http://localhost:3001/stream`)
					// setPlayMovie(`http://localhost:3001/ready`)

				}
			 })
		}

    if (playMovie)
        console.log('backrespoPLAYMOVIE', playMovie)

    return (
        <div>
            {loading ? (
                <div className="py-20">
                    <Loader/>
                </div>
            ) : (
                <div className="">
                    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                            {/* Cover Image */}
                            <div className="m-auto text-center">
                                <div className="w-3/4 m-auto text-center">
                                    <img className="m-auto min-w-[25%] rounded"
                                         src={movies.medium_cover_image}
                                         alt={movies.title}
                                    />
                                </div>
                            </div>

                            {/* Film info */}
                            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                                <h1 className="text-3xl font-bold tracking-tight text-gray-200">{movies.title}</h1>

                                <div className="mt-3">
                                    <h2 className="sr-only">Film information</h2>
                                    <p className="text-2xl tracking-tight text-gray-200">({movies.year})</p>
                                </div>

                                {/* Reviews */}
                                <div className="mt-3">
                                    <h3 className="sr-only">Reviews</h3>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {/*{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (*/}
                                            {[5, 6, 7, 8, 9].map((rating) => (
                                                <StarIcon
                                                    key={rating}
                                                    className={classNames(
                                                        movies.rating > rating ? 'text-red-500' : 'text-gray-200',
                                                        'h-5 w-5 flex-shrink-0'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            ))}
                                        </div>
                                        <p className="sr-only">IMDB Rating is {movies.rating} out of 10</p>

                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="sr-only">Description</h3>

                                    <div
                                        className="space-y-6 text-base text-gray-200"
                                        dangerouslySetInnerHTML={{__html: movies.description_full}}
                                    />
                                </div>
                                {/* PLAYER MODAL */}
                                {/* <Transition.Root show={!open} as={Fragment}>
                                    <Dialog as="div" className="relative z-10" onClose={setOpen}>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                                        </Transition.Child>

                                        <div className="fixed inset-0 z-10 overflow-y-auto">
                                            <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-out duration-300"
                                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                                    leave="ease-in duration-200"
                                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                >
                                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-zinc-800 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                                                        <div
                                                            className="container p-0 mx-auto"
                                                            style={{ minWidth: '720px', maxHeight: '80vh' }}
                                                        > */}
                                    {/* *** PLAYER *** */}

																												{/* <ReactPlayer
																													ref={playerRef}
																													url={playMovie}
																													playing={true}
																													controls={true}
																													onError={onError}
																													muted={true}
																												/>


                                                        </div>
                                                        <div className="mt-5 sm:mt-6">
                                                            <button
                                                                type="button"
                                                                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:text-sm"
                                                                onClick={() => setOpen(!open)}
                                                            >
                                                                Back to Details
                                                            </button>
                                                        </div>
                                                    </Dialog.Panel>
                                                </Transition.Child>
                                            </div>
                                        </div>
                                    </Dialog>
                                </Transition.Root> */}

                                {/* <form className="mt-6"> */}
																	{!watch ? (
																		  <div className="sm:flex-col1 mt-10 flex">
																				<button
																						type="button"
																						className="mx-2 flex max-w-xs flex-1 items-center justify-center rounded-md bg-lime-600 py-3 px-3 text-base font-medium text-white hover:bg-lime-800 sm:w-full"
																						onClick={startMovie}
																						// onClick={() => setOpen(!open)}
																				>
																						Stream
																				</button>

																				{/* <button
																						type="submit"
																						className="mx-2 flex max-w-xs flex-1 items-center justify-center rounded-md bg-red-500 py-3 px-3 text-base font-medium text-white hover:bg-red-700 sm:w-full"
																				>
																						Queue
																				</button> */}

																				<button
																						type="button"
																						className="ml-4 flex items-center justify-center rounded-md py-3 px-3 text-gray-200 hover:text-red-500"
																				>
																						<HeartIcon className="h-6 w-6 flex-shrink-0" aria-hidden="true"/>
																						<span className="sr-only">Add to favorites</span>
																				</button>
																		</div>
																	) : (null)}
                                {/* </form> */}
																{watch ? (
																<div>
																	{playMovie ? (
																		<ReactPlayer
																			ref={playerRef}
																			url={playMovie}
																			playing={true}
																			controls={true}
																			onError={onError}
																			muted={true}
																		/>
																	) : (<Loader />)}
																</div>
																 ) : (null)}



                                <section aria-labelledby="details-heading" className="mt-12">
                                    <h2 id="details-heading" className="sr-only">
                                        Additional details
                                    </h2>

                                    <div className="divide-y divide-gray-200 border-t">

                                            <Disclosure as="div">
                                                {({open}) => (
                                                    <>
                                                        <h3>
                                                            <Disclosure.Button
                                                                className="group relative flex w-full items-center justify-between py-6 text-left">
                            <span
                                className={classNames(open ? 'text-grey-300' : 'text-gray-200', 'font-bold', 'text-2xl')}
                            >
                              Details
                            </span>
                                                                <span className="ml-6 flex items-center">
                                  {open ? (
                                      <MinusIcon
                                          className="block h-6 w-6 text-red-500 group-hover:text-red-600"
                                          aria-hidden="true"
                                      />
                                  ) : (
                                      <PlusIcon
                                          className="block h-6 w-6 text-red-500 group-hover:text-red-600"
                                          aria-hidden="true"
                                      />
                                  )}
                                </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                                                            <ul role="list">
                                                                <li>
                                                                    <p className="font-semibold">IMDB Rating
                                                                        : {movies.rating}/10</p>
                                                                </li>
                                                                <br/>
                                                                <li>
                                                                    {movies.cast ? (
                                                                        <div>
                                                                            <p className="font-semibold">Starring : </p>
                                                                            {movies.cast.map((cast, index) => (
                                                                                <div key={index}>
                                                                                    {/*<img src={cast.url_small_image} alt={cast.name} />*/}
                                                                                    <p className="font-semibold">{cast.name} as {cast.character_name}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (null)}
                                                                </li>
                                                                <br/>
                                                                <li>
                                                                    {movies.genres ? (
                                                                        <div>
                                                                            <p className="font-semibold">Genres : </p>
                                                                            {movies.genres.map((genre, index) => (
                                                                                <div key={index}>
                                                                                    <p className="font-semibold">– {genre}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (null)}
                                                                </li>
                                                                <br/>
                                                                <li>
                                                                    {movies.runtime ? (
                                                                        <div>
                                                                            <p className="font-semibold">Runtime
                                                                                : {movies.runtime} minutes</p>
                                                                        </div>
                                                                    ) : (null)}
                                                                </li>


                                                                {/*{detail.items.map((item) => (*/}
                                                                {/*    <li key={item}>{item}</li>*/}
                                                                {/*))}*/}
                                                            </ul>
                                                            <div className="">
                                                                <div
                                                                    className="mx-auto max-w-2xl py-16 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:py-32">
                                                                    <div className="lg:col-span-4">
                                                                        <h2 className="text-2xl font-bold tracking-tight text-gray-300">User
                                                                            Reviews</h2>

                                                                        <div className="mt-3 flex items-center">
                                                                            <div>
                                                                                <div className="flex items-center">
                                                                                    {[0, 1, 2, 3, 4].map((rating) => (
                                                                                        <StarIcon
                                                                                            key={rating}
                                                                                            className={classNames(
                                                                                                reviews.average > rating ? 'text-yellow-400' : 'text-gray-300',
                                                                                                'flex-shrink-0 h-5 w-5'
                                                                                            )}
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                                <p className="sr-only">{reviews.average} out
                                                                                    of 5 stars</p>
                                                                            </div>
                                                                            <p className="ml-2 text-sm text-gray-300">Based
                                                                                on {reviews.totalCount} reviews</p>
                                                                        </div>

                                                                        <div className="mt-6">
                                                                            <h3 className="sr-only">Review data</h3>

                                                                            <dl className="space-y-3">
                                                                                {reviews.counts.map((count) => (
                                                                                    <div key={count.rating}
                                                                                         className="flex items-center text-sm">
                                                                                        <dt className="flex flex-1 items-center">
                                                                                            <p className="w-3 font-medium text-gray-300">
                                                                                                {count.rating}
                                                                                                <span
                                                                                                    className="sr-only"> star reviews</span>
                                                                                            </p>
                                                                                            <div aria-hidden="true"
                                                                                                 className="ml-1 flex flex-1 items-center">
                                                                                                <StarIcon
                                                                                                    className={classNames(
                                                                                                        count.count > 0 ? 'text-yellow-400' : 'text-gray-300',
                                                                                                        'flex-shrink-0 h-5 w-5'
                                                                                                    )}
                                                                                                    aria-hidden="true"
                                                                                                />

                                                                                                <div
                                                                                                    className="relative ml-3 flex-1">
                                                                                                    <div
                                                                                                        className="h-3 rounded-full border border-gray-200 bg-gray-100"/>
                                                                                                    {count.count > 0 ? (
                                                                                                        <div
                                                                                                            className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                                                                                                            style={{width: `calc(${count.count} / ${reviews.totalCount} * 100%)`}}
                                                                                                        />
                                                                                                    ) : null}
                                                                                                </div>
                                                                                            </div>
                                                                                        </dt>
                                                                                        <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-300">
                                                                                            {Math.round((count.count / reviews.totalCount) * 100)}%
                                                                                        </dd>
                                                                                    </div>
                                                                                ))}
                                                                            </dl>
                                                                        </div>

                                                                        <div className="mt-10">
                                                                            <h3 className="text-lg font-medium text-gray-300">Share
                                                                                your thoughts</h3>
                                                                            <p className="mt-1 text-sm text-gray-300">
                                                                                If you’ve watched this movie before,
                                                                                share your thoughts with other viewers.
                                                                            </p>

                                                                            <a
                                                                                href="/reviews"
                                                                                className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-red-500 py-2 px-8 text-md font-semibold text-white hover:bg-red-700 sm:w-auto lg:w-full"
                                                                            >
                                                                                Write a review
                                                                            </a>
                                                                        </div>
                                                                    </div>

                                                                    <div
                                                                        className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
                                                                        <h3 className="sr-only">Recent reviews</h3>

                                                                        <div className="flow-root">
                                                                            <div
                                                                                className="-my-12 divide-y divide-gray-200">
                                                                                {reviews.featured.map((review) => (
                                                                                    <div key={review.id}
                                                                                         className="py-12">
                                                                                        <div
                                                                                            className="flex items-center">
                                                                                            <img src={review.avatarSrc}
                                                                                                 alt={`${review.author}.`}
                                                                                                 className="h-12 w-12 rounded-full"/>
                                                                                            <div className="ml-4">
                                                                                                <h4 className="text-sm font-bold text-gray-300">{review.author}</h4>
                                                                                                <div
                                                                                                    className="mt-1 flex items-center">
                                                                                                    {[0, 1, 2, 3, 4].map((rating) => (
                                                                                                        <StarIcon
                                                                                                            key={rating}
                                                                                                            className={classNames(
                                                                                                                review.rating > rating ? 'text-yellow-400' : 'text-gray-300',
                                                                                                                'h-5 w-5 flex-shrink-0'
                                                                                                            )}
                                                                                                            aria-hidden="true"
                                                                                                        />
                                                                                                    ))}
                                                                                                </div>
                                                                                                <p className="sr-only">{review.rating} out
                                                                                                    of 5 stars</p>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div
                                                                                            className="mt-4 space-y-6 text-base italic text-gray-300"
                                                                                            dangerouslySetInnerHTML={{__html: review.content}}
                                                                                        />
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Disclosure.Panel>
                                                    </>
                                                )}
                                            </Disclosure>

                                    </div>
                                </section>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilmDetail;