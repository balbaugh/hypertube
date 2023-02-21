import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Combobox, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import axios from 'axios';

import useInfiniteScroll from 'react-infinite-scroll-hook';

import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';

import Loader from "./Loader";
import axiosStuff from "../services/axiosStuff";

const short = require('short-uuid');

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ')
// }

function valuetext(value) {
    return `${value}`;
}

const Homepage = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');
    const [ratingRange, setRatingRange] = useState([0, 10]);
    const [watched, setWatched] = useState([]);
    const [foto, setfoto] = useState('')

    // const containerRef = useRef(null);

    axios.defaults.withCredentials = true // For the sessions the work

    useEffect(() => {
        axiosStuff
            .movieTest().then((response) => {
            console.log('oikee', response)
        })
        setTimeout(() => {
            setLoading(false);
        }, 5000)
    }, [])

    useEffect(() => {
        axiosStuff
        .getWatched().then((response) => {
            setWatched(response.map(all => all.movie_id))
        })
    }, [])

    // const loadMoreMovies = async () => {
    //     setIsLoading(true);
    //     const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50&page=${currentPage}`, { withCredentials: false }); // 50 movies per page sorted by rating desc
    //     const newMovies = response.data.data.movies.filter(filterMovies);
    //     setMovies(movies.concat(newMovies));
    //     setCurrentPage(currentPage + 1);
    //     setIsLoading(false);
    // };

    const posterStuff = (code) => {
       return axiosStuff
        .getPoster(code)
        .then((response) => {
            console.log('huh', response)
            setfoto(response)
        })
    }

    console.log('FOTO', foto)

    const loadMoreMovies = async () => {
        setIsLoading(true);
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50&page=${currentPage}`, { withCredentials: false }); // 50 movies per page sorted by rating desc
        const newMovies = response.data.data.movies.filter(filterMovies).map((movie) => {
            return movie;
        });
        setMovies(movies.concat(newMovies));
        setCurrentPage(currentPage + 1);
        setIsLoading(false)
    };

     console.log('MOVIIIE', movies.map(code => code.imdb_code))

    const throttledLoadMoreMovies = debounce(loadMoreMovies, 1000);

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body - 200;
        const html = document.documentElement - 200;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + 500;
        if (windowBottom >= docHeight) {
            if (!isLoading) {
                if (hasMore) {
                    throttledLoadMoreMovies();
                }
            }
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        setMovies([]);
        setHasMore(true);
        setLoading(false)
    }, [ratingRange]);

    useEffect(() => {
        loadMoreMovies().then(r => console.log('movies', movies));
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleRatingChange = (event, newValue) => {
        setRatingRange(newValue);
    };

    const filterMovies = (movie) => {
        const ratingFilter = movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1];
        const searchFilter = query.trim() === '' || (movie.title.toLowerCase().includes(query.toLowerCase()) || movie.year.toString().includes(query.toLowerCase()) || movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase())) || movie.description_full.toString().includes(query.toLowerCase()));
        return searchFilter && (query.trim() === '' || ratingFilter);
    };

    const filteredMovies = query.trim() === '' ? movies : movies.filter(filterMovies);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleQueryChange = async (query) => {
        setQuery(query);
        if (query === '') {
            setSearchResults([]);
            setHasMore(true); // set hasMore to true when clearing search results
            setCurrentPage(1);
            setMovies([]);
            await loadMoreMovies();
            return;
        }
        setIsLoading(true);
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${query}&limit=50&page=1`, {
            withCredentials: false
        });
        setSearchResults(response.data.data.movies);
        setIsLoading(false);
        setHasMore(true); // set hasMore to true when updating movies with search results
    };

    useEffect(() => {
        if (query === '') {
            setHasMore(true);
            setCurrentPage(1);
        } else {
            setMovies(searchResults);
            setHasMore(false);
        }
    }, [searchResults, query]);

    const handleSearchKeyUp = (event) => {
        if (event.key === 'Enter') {
            handleQueryChange(query).then(() => {
                console.log('search results', searchResults);
            });
        }
    };

    const { t } = useTranslation();

    return (
        <div>
            {loading ? (
                <div className="py-20">
                    <Loader/>
                </div>
            ) : (
                <section>
                    <div className="">
                        <main>
                            <div className="mb-10">
                                <div className="flex justify-between px-4 pt-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-200">{t('BestRating.Browse')}</h1>
                                    {/* Sort */}
                                    <Menu as="div" className="relative inline-block mt-2 ml-auto text-left">
                                        <div>
                                            <Menu.Button className="inline-flex justify-center text-lg font-semibold text-gray-200 group hover:text-red-600">
                                                {t('BestRating.Sort')}
                                                <ChevronDownIcon
                                                    className="flex-shrink-0 w-5 h-5 mt-1 ml-1 -mr-1 text-red-500 group-hover:text-red-600"
                                                    aria-hidden="true"
                                                />
                                            </Menu.Button>
                                        </div>

                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <Menu.Items className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                <div className="py-1">
                                                    <Link
                                                        to="/best-rating"
                                                        className={classNames(
                                                            'font-medium text-red-500',
                                                            'block px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        {t('BestRating.BestRating')}
                                                    </Link>
                                                    <Link
                                                        to="/popular"
                                                        className={classNames(
                                                            'text-gray-500 hover:text-gray-700',
                                                            'block px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        {t('BestRating.Popular')}
                                                    </Link>
                                                    <Link
                                                        to="/newest"
                                                        className={classNames(
                                                            'text-gray-500 hover:text-gray-700',
                                                            'block px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        {t('BestRating.Newest')}
                                                    </Link>
                                                    <Link
                                                        to="/year-new-old"
                                                        className={classNames(
                                                            'text-gray-500 hover:text-gray-700',
                                                            'block px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        {t('BestRating.YearNewOld')}
                                                    </Link>
                                                    <Link
                                                        to="/year-old-new"
                                                        className={classNames(
                                                            'text-gray-500 hover:text-gray-700',
                                                            'block px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        {t('BestRating.YearOldNew')}
                                                    </Link>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>

                            {/* IMDb Score Slider */}
                            <div className="mb-3" style={{ display: "flex", justifyContent: "center" }}>
                                <Box sx={{ width: 350 }}>
                                    <h4 className="font-semibold text-gray-200">{t('BestRating.IMDbRating')}( {ratingRange[0]} - {ratingRange[1]} )</h4>
                                    <Slider
                                        defaultValue={[0, 10]}
                                        min={0}
                                        max={10}
                                        value={ratingRange}
                                        onChange={handleRatingChange}
                                        valueLabelDisplay="auto"
                                        getAriaValueText={valuetext}
                                        color="error"
                                    />
                                </Box>
                            </div>

                            {/* Search */}
                            <Combobox
                                as="div"
                                className="max-w-lg mx-auto mb-4 overflow-hidden transition-all transform divide-y divide-gray-500 shadow-2xl divide-opacity-20 rounded-xl bg-zinc-800"
                                onChange={(item) => (window.location = item.url)}
                                onSubmit={(event) => event.preventDefault()}
                            >
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <Combobox.Input
                                        className="w-full h-12 pr-4 text-white placeholder-gray-500 bg-transparent border-0 pl-11 focus:ring-0 sm:text-sm"
                                        placeholder={t('BestRating.Search')}
                                        value={query}
                                        onKeyUp={handleSearchKeyUp}
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                </div>
                            </Combobox>

                            {/* Film grid */}
                            <section
                                aria-labelledby="films-heading"
                                // className="overflow-auto"

                            >
                                <h2 id="products-heading" className="sr-only">
                                    {t('BestRating.Films')}
                                </h2>

                                <InfiniteScroll
                                    dataLength={filteredMovies.length}
                                    next={loadMoreMovies}
                                    hasMore={hasMore}
                                    loader={<h4>{t('BestRating.Loading')}</h4>}
                                    endMessage={
                                        <p style={{ textAlign: 'center' }}>
                                            <b>{t('BestRating.SeenItAll')}</b>
                                        </p>
                                    }
                                    style={{ overflow: 'hidden' }}
                                    rootMargin="0px 0px 400px 0px"
                                    // scrollableTarget="scrollableDiv"
                                >
                                    <div id="movie-list"
                                        className="container grid px-4 mx-auto mt-12 mb-16 overflow-hidden mobile:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 desktop:grid-cols-5 justify-items-center gap-11 sm:px-6 sm:mt-16 sm:mb-24 lg:px-8 min-height"
                                        >
                                        {filteredMovies.map((movie) => (
                                            <div key={`${short.generate()}`}>
                                                <div className="relative mobile:flex mobile:flex-col mobile:items-center">
                                                    <Link className="flex" key={`${movie.id}`} to={`/film/${movie.id}`}>
                                                        {watched.includes(movie.id) ? (
                                                        <img
                                                            className="border-2 border-indigo-600 border-solid rounded"
                                                            src={movie.medium_cover_image}
                                                            alt={movie.title}
                                                            onError={(e) => {
                                                                //e.target.onerror = null;
                                                                e.target.src = require('../images/noImage.png');
                                                            }}
                                                        />
                                                        ) : (
                                                            <img
                                                            className="rounded"
                                                            //src={posterStuff(movie.imdb_code)}
                                                            src={movie.medium_cover_image}
                                                            alt={movie.title}
                                                            //onError={(e) => {
                                                            //    e.target.onerror = null;
                                                            //    e.target.src = require('../images/noImage.png');
                                                            //}}
                                                        />
                                                        )}


                                                        <div className="absolute top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-full text-center bg-gray-900 opacity-0 hover:opacity-100" style={{backgroundColor: 'rgba(26, 32, 44, 0.8)'}}>
                                                            <h4 className="mb-2 text-lg font-semibold text-red-500">{movie.title}&nbsp;&nbsp;({movie.year})</h4>
                                                            <p className="text-sm font-semibold text-gray-200">IMDb: {movie.rating} / 10</p>
                                                        </div>
                                                    </Link>
                                                    <div className="mt-2 text-sm font-semibold text-center text-gray-200 desktop:hidden laptop:hidden mobile:block mobile:mt-4">
                                                        <p className="mb-2 font-semibold text-red-500 text-md">{movie.title}&nbsp;&nbsp;({movie.year})</p>
                                                        <p className="mb-1 text-sm font-semibold text-red-400">IMDb: {movie.rating} / 10</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </InfiniteScroll>

                            </section>
                        </main>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Homepage;
