import React, {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import ReactPlayer from 'react-player'
import {Disclosure} from '@headlessui/react'
import {StarIcon} from '@heroicons/react/20/solid'
import {MinusIcon, PlusIcon} from '@heroicons/react/24/outline'
import {useTranslation} from 'react-i18next';
import axios from "axios";
import axiosStuff from "../services/axiosStuff";
import Loader from "./Loader";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const FilmDetail = ({itsMe}) => {
    const {id} = useParams();
    const [movies, setMovies] = useState(id);
    const [loading, setLoading] = useState(true);
    const [watch, setWatch] = useState(false);
    const [playMovie, setPlayMovie] = useState('');
    // const [open, setOpen] = useState(true)
    const playerRef = useRef(null);
    const [comments, setComments] = useState('');
    const [newComment, setNewComment] = useState('');
    const [users, setUsers] = useState([])
    const [subs, setSubs] = useState([]);

    console.log('playerrf', playerRef)
    console.log('mee', itsMe.username)
    console.log('movie', movies)

    const onError = useCallback(() => {
        if (playerRef.current !== null) {
            playerRef.current.seekTo(0, 'seconds');
        }
    }, [playerRef])

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
        });

        const fetchNewComments = setInterval(() => {
            axiosStuff.getComments(id)
                .then((response) => {
                    setComments(response);
                }).then(() => {
                axiosStuff.getCommentUser()
                    .then((response1) => {
                        setUsers(response1)
                    })
            })
        }, 3000);

        // cleanup function to clear interval when component unmounts or id changes
        return () => clearInterval(fetchNewComments);
    }, [id]);

    useEffect(() => {
        axios.get(`/movies/${id}/comments`).then((response) => {
            setComments(response.data);
        });
    }, [id]);

    console.log('comments', comments)
    console.log('users', users)

    const textInput =  React.useRef(null);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        if (itsMe.username) {
            let text1 = newComment.trim();
            if (text1.length > 255) {
                text1 = text1.slice(0, 255);
            }
            if (text1.length === 0) {
                return;
            }
            else if (newComment.replace(/\s/g, '').length === 0) {
                setNewComment('');
                return
            }
            const comment = {
                movie_id: movies.id,
                user_id: itsMe.id,
                text1: newComment.trim(),
                text: text1.slice(0, 255)
            };
            axiosStuff.submitComment(comment)
                .then((response) => {
                    setComments([...comments, response.data]);
                    setNewComment("");
                    // commentInputRef.current.reset()

                    // event.target.comment.value = '';
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };


    const handleNewComment = (event) => {
        setNewComment(event.target.value)
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
        // .then((response) => {
        //    console.log('subs', response)
        //    setSubs(response)
        // })
        setTimeout(() => {
            console.log('TAMA', imdbCode)
            axiosStuff.getSubs({imdbCode})
                .then((response2) => {
                    console.log('subs', response2)
                    setSubs(response2)
                })
        }, 1000)

        axiosStuff
            .play({title, magnetUrl, imdbCode})
            .then((response) => {
                console.log('hii', response)
                if (response.downloaded) {
                    setPlayMovie(`http://localhost:3001/ready`)
                } else {
                    setPlayMovie(`http://localhost:3001/stream`)
                }
            })
    }

    if (playMovie)
        console.log('backrespoPLAYMOVIE', playMovie)

    const subsConfig = {
        file: {
            attributes: {
                crossOrigin: 'true'
            },
            tracks: subs.filter((sub) => sub.imdb_code === movies.imdb_code)
                .map((sub) => ({
                    kind: 'subtitles',
                    src: `http://localhost:3001/${sub.path}`,
                    srcLang: sub.language,
                    default: sub.language === 'en' ? 'en' : ''
                }))
        }
    }

    if (subsConfig.file.tracks.length)
        console.log('subsconf', subsConfig)

    const {t} = useTranslation();

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
                                    <h2 className="sr-only">{t('FilmDetail.filmInformation')}</h2>
                                    <p className="text-3xl font-bold text-gray-200">{movies.title}&nbsp;&nbsp;({movies.year})</p>
                                    {/*<p className="text-2xl text-gray-200">({movies.year})</p>*/}
                                </div>

                                {/* Reviews */}
                                <div className="mt-3">
                                    <h3 className="sr-only">{t('FilmDetail.reviews')}</h3>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            <p className="text-xl font-semibold text-gray-200">IMDb:&nbsp;</p>
                                        </div>
                                        <p className="text-xl">&nbsp;{movies.rating}&nbsp;</p>
                                        <StarIcon
                                            aria-hidden="true"
                                            className="flex-shrink-0 w-5 h-5 text-red-500"
                                        />
                                        <p className="text-xl">&nbsp;{t('FilmDetail.outOfTen')}</p>
                                    </div>
                                </div>

                                {!watch ? (
                                    <div className="mt-3 flex sm:flex-col1">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center flex-1 max-w-full px-3 py-3 mx-2 text-base font-medium text-white rounded-md bg-lime-600 hover:bg-lime-800 sm:w-full"
                                            onClick={startMovie}
                                            // onClick={() => setOpen(!open)}
                                        >
                                            {t('FilmDetail.stream')}
                                        </button>
                                    </div>
                                ) : (null)}
                                {/* </form> */}
                                {watch ? (
                                    <div className="mt-9">
                                        {playMovie ? (
                                            <ReactPlayer
                                                ref={playerRef}
                                                url={playMovie}
                                                playing={true}
                                                controls={true}
                                                onError={onError}
                                                muted={true}
                                                config={subsConfig}
                                            />
                                        ) : (<Loader/>)}
                                    </div>
                                ) : (null)}

                                {/* DETAILS PANEL */}
                                <section aria-labelledby="details-heading" className="mt-9">
                                    <h2 id="details-heading" className="sr-only">
                                        {t('FilmDetail.details')}
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
                                                                  {t('FilmDetail.details')}
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
                                                        <Disclosure.Panel as="div" className="pt-8 pb-6 prose prose-md">
                                                            <div className="">
                                                                <div
                                                                    className="max-w-2xl py-2 mx-auto lg:grid lg:max-w-7xl lg:grid-cols-12">
                                                                    <h2 className="text-xl text-red-500">{t('FilmDetail.summary')}:</h2>
                                                                    <div
                                                                        className="space-y-6 text-base"
                                                                        dangerouslySetInnerHTML={{__html: movies.description_full}}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <ul role="list">
                                                                <li className="py-2">
                                                                    <p className="text-xl text-red-500">{t('FilmDetail.runtime')}:</p>
                                                                    {movies.runtime && (
                                                                        <p className="">– {movies.runtime} minutes</p>
                                                                    )}
                                                                </li>
                                                                <li className="py-2">
                                                                    {movies.cast && (
                                                                        <div>
                                                                            <p className="text-xl text-red-500">{t('FilmDetail.starring')}:</p>
                                                                            <ul role="list">
                                                                                {movies.cast.map((cast, index) => (
                                                                                    <li key={index}>
                                                                                        <p>
                                                                                            <span
                                                                                                className="font-semibold">– {cast.name}</span> as {cast.character_name}
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
                                                                            <p className="text-xl text-red-500">{t('FilmDetail.genres')}:</p>
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
                                                                  {t('FilmDetail.comments')}
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

                                                {/* COMMENTS PANEL */}
                                                <Disclosure.Panel as="div" className="pb-6 prose-sm prose">
                                                    <div className="flex items-start pt-8 pb-6 space-x-4">
                                                        <div className="flex-1 min-w-0">
                                                            <form onSubmit={handleCommentSubmit} className="relative">
                                                                <div
                                                                    className="overflow-hidden border border-gray-300 rounded-lg shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
                                                                    <label htmlFor="comment" className="sr-only">
                                                                        {t('FilmDetail.addComment')}
                                                                    </label>
                                                                    <textarea
                                                                        rows={3}
                                                                        name="comment"
                                                                        id="comment"
                                                                        className="block w-full text-gray-700 py-3 border-0 resize-none focus:ring-0 sm:text-sm"
                                                                        placeholder={t('FilmDetail.addComment')}
                                                                        defaultValue={''}
                                                                        value={newComment}
                                                                        onChange={handleNewComment}
                                                                        inputRef={textInput}
                                                                    />

                                                                    {/* Spacer element to match the height of the toolbar */}
                                                                    <div className="py-2" aria-hidden="true">
                                                                        {/* Matches height of button in toolbar (1px border + 36px content height) */}
                                                                        <div className="py-px">
                                                                            <div className="h-9"/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                                                                    <div className="flex-shrink-0">
                                                                        <button
                                                                            type="submit"
                                                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                                            onClick={() => {
                                                                                textInput.current.value = "";
                                                                            }}
                                                                        >
                                                                            {t('FilmDetail.post')}
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className="mt-2 lg:col-span-7 lg:col-start-6 lg:mt-0">
                                                        <h3 className="sr-only">{t('FilmDetail.comments')}</h3>
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
                                                                                {/*<img*/}
                                                                                {/*    className="inline-block w-10 h-10 rounded-full"*/}
                                                                                {/*    // src={comment.user.profile_pic_path}*/}
                                                                                {/*    alt={username}*/}
                                                                                {/*/>*/}
                                                                                <div className="ml-4">
                                                                                    <h4 className="text-sm font-bold text-red-400">
                                                                                        {username}
                                                                                    </h4>
                                                                                    <p className="text-sm text-gray-400">
                                                                                        {comment.created_at.substring(0, 10)} {comment.created_at.substring(11, 19)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="ml-8 mt-4 space-y-6 text-base italic text-gray-300"
                                                                            >
                                                                                {comment.text}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            ) : (
                                                                <div className="py-6">
                                                                    <div
                                                                        className="flex items-center">
                                                                        <div className="ml-4">
                                                                            <h4 className="text-sm font-bold text-gray-300">
                                                                                {t('FilmDetail.noComments')}
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 border-t divide-y divide-gray-200"/>
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