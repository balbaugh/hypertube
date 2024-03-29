import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Combobox, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { debounce } from 'lodash';
import Loader from "./Loader";
import axiosStuff from "../services/axiosStuff";

const short = require('short-uuid');

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
    const [posterUrls, setPosterUrls] = useState({});
    const loadMoreRef = useRef();
    const rootRef = useRef(null);
    const { t } = useTranslation();

    axios.defaults.withCredentials = true // For the sessions the work

    // useEffect(() => {
    //     axiosStuff
    //         .movieTest().then((response) => {
    //         console.log('oikee', response)
    //     })
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 5000)
    // }, [])

    useEffect(() => {
        axiosStuff.getWatched()
            .then((response) => {
                // console.log('response', response)
                if (response !== false)
                    setWatched(response.map(all => all.movie_id))
            }).catch(error => {
                // console.log('Caught an error')
            })
    }, [])

    // console.log('WATHCEEED', watched)

    const loadMoreMovies = async () => {
        // console.log('********************')
        // console.log('EXECUTING LOAD MORE!')
        // console.log('********************')
        setIsLoading(true);
        const response = await axios.get(
            `https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=20&page=${currentPage}`,
            { withCredentials: false }
        );
        const newMovies = response.data.data.movies.filter(filterMovies);
        setMovies((prevMovies) => prevMovies.concat(newMovies)); // <-- Update movies state
        setCurrentPage(currentPage + 1);
        setIsLoading(false);

        // Fetch poster images for new movies
        const moviesToFetch = newMovies.filter((movie) => !posterUrls[movie.imdb_code]);

        moviesToFetch.forEach((movie) => {
            const fetchPoster = async (code) => {
                try {
                    const response = await axiosStuff.getPoster(code);
                    // const url = `https://image.tmdb.org/t/p/w500/${response}`;
                    const url = response
                    setPosterUrls((prevState) => ({ ...prevState, [code]: url }));
                } catch (error) {
                    console.error(error);
                }
            };

            fetchPoster(movie.imdb_code);
        });
    };

    const throttledLoadMoreMovies = debounce(loadMoreMovies, 1000);

    useEffect(() => {
        setCurrentPage(1);
        setMovies([]);
        setHasMore(true);
        setLoading(false)
    }, [ratingRange]);

    useEffect(() => {
        loadMoreMovies()
        //.then(r => console.log('movies', movies));
        const loadMoreNode = loadMoreRef.current;
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                if (!isLoading) {
                    if (hasMore) {
                        throttledLoadMoreMovies();
                    }
                }
            }
        }, {
            root: rootRef.current,
            rootMargin: "100px",
            threshold: 0.5
        });
        if (loadMoreNode) {
            observer.observe(loadMoreNode);
        }
        return () => {
            if (loadMoreNode) {
                observer.unobserve(loadMoreNode);
            }
        };
    }, []);

    const handleRatingChange = (event, newValue) => {
        setRatingRange(newValue);
    };

    const filterMovies = (movie) => {
        const ratingFilter = movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1];
        const searchFilter = query.trim() === '' || (movie.title.toLowerCase().includes(DOMPurify.sanitize(query).toLowerCase()) || movie.year.toString().includes(DOMPurify.sanitize(query).toLowerCase()) || movie.genres.some(genre => genre.toLowerCase().includes(DOMPurify.sanitize(query).toLowerCase())) || movie.description_full.toString().includes(DOMPurify.sanitize(query).toLowerCase()));
        return searchFilter && (query.trim() === '' || ratingFilter);
    };

    const filteredMovies = query.trim() === '' ? movies : movies.filter(filterMovies);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleQueryChange = async (query) => {
        const sanitizedQuery = DOMPurify.sanitize(query); // Sanitize the query using DOMPurify
        const cleanQuery = sanitizedQuery.trim(); // Trim the query
        if (cleanQuery === '') {
            return;
        }
        if (/^[a-zA-Z0-9\s.,!?]*$/.test(cleanQuery) === false) {
            return;
        }
        setQuery(cleanQuery);
        setIsLoading(true);
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${cleanQuery}&limit=20&page=1`, {
            withCredentials: false
        });
        if (!response.data.data.movies) {
            window.location.replace('/homepage')
        } else {
            setSearchResults(response.data.data.movies);
            setIsLoading(false);
            setHasMore(true); // set hasMore to true when updating movies with search results
        }
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
            const sanitizedQuery = DOMPurify.sanitize(query); // Sanitize the query using DOMPurify
            handleQueryChange(sanitizedQuery)
						// .then(() => {
            //     console.log('search results', searchResults);
            // });
        }
    };

    useEffect(() => {
        const fetchPoster = async (code) => {
            if (!posterUrls[code]) { // check if poster URL has already been fetched
                try {
                    // console.log('FETCHING POSTER!!!')
                    const response = await axiosStuff.getPoster(code);
                    const url = response
                    setPosterUrls((prevState) => ({ ...prevState, [code]: url }));
                } catch (error) {
                    console.log('Caught an error:', error);
                }
            }
        };

        const moviesToFetch = filteredMovies.filter((movie) => !posterUrls[movie.imdb_code]);

        moviesToFetch.forEach((movie) => {
            fetchPoster(movie.imdb_code);
        })
    }, [filteredMovies]);

    return (
        <div>
            {loading ? (
                <div className="py-20">
                    <Loader />
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
                                            <Menu.Button
                                                className="inline-flex justify-center text-lg font-semibold text-gray-200 group hover:text-red-600">
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
                                            <Menu.Items
                                                className="absolute right-0 z-10 w-40 mt-2 origin-top-right bg-white rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                            <div
                                aria-labelledby="films-heading"
                                className="overflow-visible"
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
                                    scrollableTarget={rootRef}
                                >
                                    <div ref={rootRef}
                                        className="container grid px-4 mx-auto mt-12 mb-16 overflow-hidden mobile:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 desktop:grid-cols-5 justify-items-center gap-11 sm:px-6 sm:mt-16 sm:mb-24 lg:px-8"
                                    >
                                        {filteredMovies.map((movie) => (
                                            <div key={`${short.generate()}`}>
                                                <div
                                                    className="relative mobile:flex mobile:flex-col mobile:items-center">
                                                    <Link
                                                        className="flex"
                                                        key={`${movie.id}`}
                                                        to={`/film/${movie.id}`}
                                                    >
                                                        {watched.includes(movie.id) ? (
                                                            <div>
                                                                <img
                                                                    className="border-2 border-indigo-600 border-solid rounded filter grayscale"
                                                                    src={
                                                                        posterUrls[movie.imdb_code] ||
                                                                        require('../images/noImage.png')
                                                                    }
                                                                    alt={movie.title}
                                                                    loading='lazy'
                                                                />
                                                                <span
                                                                    className="absolute top-0 left-0 flex items-center justify-center w-full h-full text-lg font-semibold text-center uppercase bg-black bg-opacity-50 rounded text-red"
                                                                >
                                                                    Watched
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <img
                                                                className="rounded"
                                                                src={
                                                                    posterUrls[movie.imdb_code] ||
                                                                    require('../images/noImage.png')
                                                                }
                                                                alt={movie.title}
                                                                loading='lazy'
                                                            />
                                                        )}
                                                        <div
                                                            className="absolute top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-full text-center bg-gray-900 opacity-0 hover:opacity-100"
                                                            style={{ backgroundColor: "rgba(26, 32, 44, 0.8)" }}
                                                        >
                                                            <h4 className="mb-2 text-lg font-semibold text-red-500">
                                                                {movie.title}&nbsp;&nbsp;({movie.year})
                                                            </h4>
                                                            <p className="text-sm font-semibold text-gray-200">
                                                                IMDb: {movie.rating} / 10
                                                            </p>
                                                        </div>
                                                    </Link>
                                                    <div
                                                        className="mt-2 text-sm font-semibold text-center text-gray-200 desktop:hidden laptop:hidden mobile:block mobile:mt-4">
                                                        <p className="mb-2 font-semibold text-red-500 text-md">
                                                            {movie.title}&nbsp;&nbsp;({movie.year})
                                                        </p>
                                                        <p className="mb-1 text-sm font-semibold text-red-400">
                                                            IMDb: {movie.rating} / 10
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </InfiniteScroll>
                                <div ref={loadMoreRef} />
                            </div>
                        </main>
                    </div>
                </section>
            )}
        </div>
    )
}

export default Homepage;
