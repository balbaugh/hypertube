import React, { Fragment, useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import ReactPlayer from 'react-player'
import { Dialog, Disclosure, Listbox, Transition} from '@headlessui/react'
import { StarIcon } from '@heroicons/react/20/solid'
import {MinusIcon, PlusIcon} from '@heroicons/react/24/outline'
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
                'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
        // More reviews...
    ],
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const FilmDetail = ({ itsMe }) => {
    const {id} = useParams();
    const [movies, setMovies] = useState(id);
    const [loading, setLoading] = useState(true);
    const [watch, setWatch] = useState(false);
    const [playMovie, setPlayMovie] = useState('');
    const [open, setOpen] = useState(true)
    const playerRef = useRef(null);
    const [comments, setComments] = useState([]);
		const [newComment, setNewComment] = useState('');
		const [users, setUsers] = useState([])

    console.log('playerrf', playerRef)
		console.log('mee', itsMe.username)
		console.log('movie', movies)

    const onError = useCallback(() => {
        if (playerRef.current !== null) {
            playerRef.current.seekTo(0, 'seconds');
        }
    }, [playerRef])

		const handleNewComment = (event) => {
			setNewComment(event.target.value)
		}

    useEffect(() => {
        axiosStuff.toMovie(id)
            .then((response) => {
                if (response.parsed.data.movie) {
                    setMovies(response.parsed.data.movie);
                    setLoading(false);
                } else {
                    window.location.replace('/');
                }
            })
            .catch((error) => {
                console.log(error);
            });

        axiosStuff.getComments(id)
            .then((response) => {
                setComments(response);
            }).then(() => {
							axiosStuff.getCommentUser()
							.then((response1) => {
								setUsers(response1)
							})
						})
    }, [id]);

		console.log('comments', comments)
		console.log('users', users)

    const handleCommentSubmit = (event) => {
        event.preventDefault();
				if (itsMe.username) {
					const comment = {
						movie_id: movies.id,
						user_id: itsMe.id,
						text: newComment
					}
					axiosStuff
					.submitComment(comment)
					.then((response) => {
            setComments([...comments, response.data]);
              event.target.comment.value = '';
            })
            .catch((error) => {
               console.log(error);
            });
				};
	}

	const startMovie = () => {
		const movieHash = movies.torrents[0].hash;
		const title = movies.title
		const encodedTitle = encodeURIComponent(title);
		const magnetUrl = `magnet:?xt=urn:btih:${movieHash}&dn=${encodedTitle}`
		const imdbCode = movies.imdb_code;
		// setOpen(!open)
		setWatch(true);
    axiosStuff
    .subtitles({imdbCode})
    .then((response) => {
        console.log('subs', response)
    })
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

	// const filteredComments = comments.filter((comment => {
	//	return comment.user.id = users.id
	// }))

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
                    <div className="max-w-2xl px-4 py-16 mx-auto sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
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
                            <div className="px-4 mt-10 sm:mt-16 sm:px-0 lg:mt-0">


                                <div className="mt-3">
                                    <h2 className="sr-only">Film information</h2>
                                    <p className="text-3xl font-bold text-gray-200">{movies.title}&nbsp;&nbsp;({movies.year})</p>
                                    {/*<p className="text-2xl text-gray-200">({movies.year})</p>*/}
                                </div>

                                {/* Reviews */}
                                <div className="mt-3">
                                    <h3 className="sr-only">Reviews</h3>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {/*{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((rating) => (*/}
                                            {/*{[5, 6, 7, 8, 9].map((rating) => (*/}
                                            {/*    <StarIcon*/}
                                            {/*        key={rating}*/}
                                            {/*        className={classNames(*/}
                                            {/*            movies.rating > rating ? 'text-red-500' : 'text-gray-200',*/}
                                            {/*            'h-5 w-5 flex-shrink-0'*/}
                                            {/*        )}*/}
                                            {/*        aria-hidden="true"*/}
                                            {/*    />*/}
                                            {/*))}*/}
                                            <p className="font-semibold text-xl text-gray-200">IMDB:&nbsp;</p>
                                        </div>
                                        <p className="text-xl">&nbsp;{movies.rating}&nbsp;</p>
                                        <StarIcon
                                            aria-hidden="true"
                                            className="h-5 w-5 flex-shrink-0 text-red-500"
                                        />
                                        <p className="text-xl">&nbsp;out of 10</p>

                                    </div>
                                </div>

                                {/* DESCRIPTION */}
                                {/*<div className="mt-6">*/}
                                {/*    <h3 className="sr-only">Description</h3>*/}

                                {/*    <div*/}
                                {/*        className="space-y-6 text-base text-gray-200"*/}
                                {/*        dangerouslySetInnerHTML={{__html: movies.description_full}}*/}
                                {/*    />*/}
                                {/*</div>*/}

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
                                            <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" />
                                        </Transition.Child>

                                        <div className="fixed inset-0 z-10 overflow-y-auto">
                                            <div className="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
                                                <Transition.Child
                                                    as={Fragment}
                                                    enter="ease-out duration-300"
                                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                                    leave="ease-in duration-200"
                                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                                >
                                                    <Dialog.Panel className="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform rounded-lg shadow-xl bg-zinc-800 sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
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
                                                                className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-500 border border-transparent rounded-md shadow-sm hover:bg-red-700 sm:text-sm"
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
								  <div className="flex mt-10 sm:flex-col1">
										<button
												type="button"
												className="flex items-center justify-center flex-1 max-w-full px-3 py-3 mx-2 text-base font-medium text-white rounded-md bg-lime-600 hover:bg-lime-800 sm:w-full"
												onClick={startMovie}
												// onClick={() => setOpen(!open)}
										>
												Stream
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

                                {/* DETAILS PANEL */}
                                <section aria-labelledby="details-heading" className="mt-12">
                                    <h2 id="details-heading" className="sr-only">
                                        Additional details
                                    </h2>

                                    <div className="border-t divide-y divide-gray-200">

                                            <Disclosure as="div">
                                                {({open}) => (
                                                    <>
                                                        <h3>
                                                            <Disclosure.Button
                                                                className="relative flex items-center justify-between w-full py-6 text-left group">
                                                                <span
                                                                    className={classNames(open ? 'text-grey-300' : 'text-gray-200', 'font-bold', 'text-2xl')}
                                                                >
                                                                  Details
                                                                </span>
                                                                    <span className="flex items-center ml-6">
                                                                      {open ? (
                                                                          <MinusIcon
                                                                              className="block w-6 h-6 text-red-500 group-hover:text-red-600"
                                                                              aria-hidden="true"
                                                                          />
                                                                      ) : (
                                                                          <PlusIcon
                                                                              className="block w-6 h-6 text-red-500 group-hover:text-red-600"
                                                                              aria-hidden="true"
                                                                          />
                                                                      )}
                                                                    </span>
                                                            </Disclosure.Button>
                                                        </h3>
                                                        <div className="border-t divide-y divide-gray-200">
                                                            <Disclosure.Panel as="div" className="pt-8 pb-6 prose-md prose">
                                                                <div className="">
                                                                    <div className="max-w-2xl py-2 mx-auto lg:grid lg:max-w-7xl lg:grid-cols-12">
                                                                        <h2 className="font-semibold">Summary:</h2>
                                                                        <div
                                                                            className="space-y-6 text-base"
                                                                            dangerouslySetInnerHTML={{ __html: movies.description_full }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <ul role="list">
                                                                    <li className="py-2">
                                                                        {movies.runtime && (
                                                                            <p className=""><b>Runtime:</b> {movies.runtime} minutes</p>
                                                                        )}
                                                                    </li>
                                                                    <li className="py-2">
                                                                        {movies.cast && (
                                                                            <div>
                                                                                <p className="font-semibold">Starring:</p>
                                                                                <ul role="list">
                                                                                    {movies.cast.map((cast, index) => (
                                                                                        <li key={index}>
                                                                                            <p>
                                                                                                <span className="font-semibold">{cast.name}</span> as {cast.character_name}
                                                                                            </p>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </li>
                                                                    <li className="py-2">
                                                                        {movies.genres && (
                                                                            <div>
                                                                                <p className="font-semibold">Genres:</p>
                                                                                <ul role="list">
                                                                                    {movies.genres.map((genre, index) => (
                                                                                        <li key={index}>
                                                                                            <p>- {genre}</p>
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </div>
                                                                        )}
                                                                    </li>

                                                                </ul>

                                                                <div className="mt-6 border-t divide-y divide-gray-200"/>
                                                            </Disclosure.Panel>

                                                        </div>
                                                    </>
                                                )}
                                            </Disclosure>
                                    </div>
                                    <Disclosure as="div">
                                        {({open}) => (
                                            <>
                                                <h3>
                                                    <Disclosure.Button
                                                        className="relative flex items-center justify-between w-full py-6 text-left group">
                                                                <span
                                                                    className={classNames(open ? 'text-grey-300' : 'text-gray-200', 'font-bold', 'text-2xl')}
                                                                >
                                                                  Comments
                                                                </span>
                                                        <span className="flex items-center ml-6">
                                                                      {open ? (
                                                                          <MinusIcon
                                                                              className="block w-6 h-6 text-red-500 group-hover:text-red-600"
                                                                              aria-hidden="true"
                                                                          />
                                                                      ) : (
                                                                          <PlusIcon
                                                                              className="block w-6 h-6 text-red-500 group-hover:text-red-600"
                                                                              aria-hidden="true"
                                                                          />
                                                                      )}
                                                                    </span>
                                                    </Disclosure.Button>
                                                </h3>
                                                <Disclosure.Panel as="div" className="pb-6 prose-sm prose">

                                        {/* COMMENTS PANEL */}
                                                    <div className="flex items-start pt-8 pb-6 space-x-4">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                className="inline-block w-12 h-12 rounded-full"
                                                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <form onSubmit={handleCommentSubmit} className="relative">
                                                                <div className="overflow-hidden border border-gray-300 rounded-lg shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                                                                    <label htmlFor="comment" className="sr-only">
                                                                        Add your comment
                                                                    </label>
                                                                    <textarea
                                                                        rows={3}
                                                                        name="comment"
                                                                        id="comment"
                                                                        className="block w-full py-3 border-0 resize-none focus:ring-0 sm:text-sm"
                                                                        placeholder="Add your comment..."
                                                                        defaultValue={''}
																																				onChange={handleNewComment}
                                                                    />

                                                                    {/* Spacer element to match the height of the toolbar */}
                                                                    <div className="py-2" aria-hidden="true">
                                                                        {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                                                        <div className="py-px">
                                                                            <div className="h-9" />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                                                                    <div className="flex-shrink-0">
                                                                        <button
                                                                            type="submit"
                                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                        >
                                                                            Post
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 border-t divide-y divide-gray-200">
                                                    <div
                                                        className="pt-8 mt-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
                                                        <h3 className="sr-only">Recent Comments</h3>

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
                                                                                 className="w-12 h-12 rounded-full"/>
                                                                            <div className="ml-4">
                                                                                <h4 className="text-sm font-bold text-gray-300">{review.author}</h4>
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
                                                        <div className="mt-4 border-t divide-y divide-gray-200">
                                                            <div
                                                                className="pt-8 mt-6 lg:col-span-7 lg:col-start-6 lg:mt-0">
                                                                <h3 className="sr-only">Recent Comments</h3>
                                                        <div className="mt-4 border-t divide-y divide-gray-200">
                                                            {comments.length > 0 ? (
                                                                comments.map((comment) => {
																																	const user = users.find(user => user.id === comment.user_id)
																																	const username = user.username
																																	return (
                                                                    <div key={comment.id}
                                                                         className="py-6">
                                                                        <div
                                                                            className="flex items-center">
                                                                            <img
                                                                                className="inline-block w-10 h-10 rounded-full"
                                                                                // src={comment.user.profile_pic_path}
                                                                                // alt={comment.user.username}
                                                                            />
                                                                            <div className="ml-4">
                                                                                <h4 className="text-sm font-bold text-gray-300">
                                                                                    {username}
                                                                                </h4>
                                                                                <p className="text-sm text-gray-400">
                                                                                    {comment.created_at}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="mt-4 space-y-6 text-base italic text-gray-300"
                                                                            dangerouslySetInnerHTML={{__html: comment.text}}
                                                                        />
                                                                    </div>
                                                                )
																																})
                                                            ) : (
                                                                <div className="py-6">
                                                                    <div
                                                                        className="flex items-center">
                                                                        <div className="ml-4">
                                                                            <h4 className="text-sm font-bold text-gray-300">
                                                                                No comments yet
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {/*    <div key={comment.id} className="py-6">*/}
                                                            {/*        <div className="flex items-center">*/}
                                                            {/*            <img*/}
                                                            {/*                className="inline-block w-10 h-10 rounded-full"*/}
                                                            {/*                src={comment.user.profile_pic_path}*/}
                                                            {/*                alt={comment.user.username}*/}
                                                            {/*            />*/}
                                                            {/*            <div className="ml-4">*/}
                                                            {/*                <h4 className="text-sm font-bold text-gray-300">*/}
                                                            {/*                    {comment.user.username}*/}
                                                            {/*                </h4>*/}
                                                            {/*                <p className="text-sm text-gray-400">*/}
                                                            {/*                    {comment.created_at}*/}
                                                            {/*                </p>*/}
                                                            {/*            </div>*/}
                                                            {/*        </div>*/}
                                                            {/*        <div className="mt-4 space-y-6 text-base text-gray-300">*/}
                                                            {/*            <p>{comment.body}</p>*/}
                                                            {/*        </div>*/}
                                                            {/*    </div>*/}
                                                            {/*))}*/}
                                                        </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
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
