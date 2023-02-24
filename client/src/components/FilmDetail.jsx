import React, {useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import ReactPlayer from 'react-player'
import {Disclosure} from '@headlessui/react'
import {StarIcon} from '@heroicons/react/20/solid'
import {MinusIcon, PlusIcon} from '@heroicons/react/24/outline'
import {useTranslation} from 'react-i18next';
import axiosStuff from "../services/axiosStuff";
import Loader from "./Loader";
import CommentElement from './CommentElement';

const backUp = require('../images/noImage.png');
const imageError = (e) => {
    console.log('Image failed to load:', e.target.src);

    e.target.src = backUp;
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

// itsMe is exported into CommentElement but not used here otherwise.
const FilmDetail = ({itsMe}) => {
    const {id} = useParams();
    const [movies, setMovies] = useState(id);
    const [loading, setLoading] = useState(true);
    const [watch, setWatch] = useState(false);
    const [playMovie, setPlayMovie] = useState('');
    const playerRef = useRef(null);
    const [subs, setSubs] = useState([]);
    const [posterUrls, setPosterUrls] = useState({});
    const {t} = useTranslation();
    const savedLanguage = localStorage.getItem('language')

    const onError = useCallback(() => {
        if (playerRef.current !== null) {
            playerRef.current.seekTo(0, 'seconds');
        }
    }, [playerRef.current])

    const fetchPoster = async (code) => {
        if (!posterUrls[code]) { // check if poster URL has already been fetched
            try {
                console.log('FETCHING POSTER!!!')
                const response = await axiosStuff.getPoster(code);
                // const url = `https://image.tmdb.org/t/p/w500/${response}`;
                const url = response
                setPosterUrls((prevState) => ({...prevState, [code]: url}));
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        axiosStuff.toMovie(id)
            .then((response) => {
                if (response.parsed.data.movie) {
                    if (response.parsed.data.movie.id === 0) {
                        window.location.replace('/homepage')
                    }
                    setMovies(response.parsed.data.movie);
                    fetchPoster(response.parsed.data.movie.imdb_code);
                    setLoading(false);
                } else {
                    window.location.replace('/homepage');
                }
            })
            .catch((error) => {
                console.log('tomovie CATCH ERRROR', error);
            });
    }, [id]);

    const startMovie = () => {
        const movieHash = movies.torrents[0].hash;
        const title = movies.title
        const encodedTitle = encodeURIComponent(title);
        const magnetUrl = `magnet:?xt=urn:btih:${movieHash}&dn=${encodedTitle}`
        const imdbCode = movies.imdb_code;
        const movieId = movies.id

        axiosStuff
            .addWatched({movieId})
        setWatch(true);
        axiosStuff
            .subtitles({imdbCode})
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
                    default: sub.language === `${savedLanguage}` ? `${savedLanguage}` : ''
                }))
        }
    }

    if (subsConfig.file.tracks.length)
        console.log('subsconf', subsConfig)

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
                                         src={
                                             posterUrls[movies.imdb_code] ||
                                             require('../images/noImage.png')
                                         }
                                         alt={movies.title}
                                    />
                                </div>
                            </div>

                            {/* Film info */}
                            <div className="px-4 mt-10 sm:mt-16 sm:px-0 lg:mt-0">
                                <div className="mt-3">
                                    <h2 className="sr-only">{t('FilmDetail.filmInformation')}</h2>
                                    <p className="text-3xl font-bold text-gray-200">{movies.title}&nbsp;&nbsp;({movies.year})</p>
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
                                    <div className="flex mt-3 sm:flex-col1">
                                        <button
                                            type="button"
                                            className="flex items-center justify-center flex-1 max-w-full px-3 py-3 mx-2 text-base font-medium text-white rounded-xl bg-lime-600 hover:bg-lime-800 sm:w-full"
                                            onClick={startMovie}
                                        >
                                            {t('FilmDetail.stream')}
                                        </button>
                                    </div>
                                ) : null}
                                {/* </form> */}
                                {watch ? (
                                    <div className="w-full mt-9 sm:w-auto">
                                        {playMovie ? (
                                            <ReactPlayer
                                                ref={playerRef}
                                                url={playMovie}
                                                playing={true}
                                                controls={true}
                                                onError={onError}
                                                muted={true}
                                                config={subsConfig}
                                                width='100%'
                                                height='100%'
                                                className='sm:w-auto sm:h-auto'
                                            />
                                        ) : (<Loader/>)}
                                    </div>
                                ) : null}

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
                                                            <ul>
                                                                <li className="py-2">
                                                                    <p className="text-xl text-red-500">{t('FilmDetail.runtime')}:</p>
                                                                    {movies.runtime && (
                                                                        <p className="">– {movies.runtime} {t('FilmDetail.minutes')}</p>
                                                                    )}
                                                                </li>
                                                                <li className="py-2">
                                                                    {movies.cast && (
                                                                        <div>
                                                                            <p className="text-xl text-red-500">{t('FilmDetail.starring')}:</p>
                                                                            <ul>
                                                                                {movies.cast.map((cast, index) => (
                                                                                    <li key={index}>
                                                                                        <p>
                                                                                            <span
                                                                                                className="font-semibold">– {cast.name}</span> {t('FilmDetail.inRole')} {cast.character_name}
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
                                                                            <ul>
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
                                                <CommentElement id={id} itsMe={itsMe} movies={movies}/>
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
