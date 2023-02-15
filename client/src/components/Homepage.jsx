import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Combobox, Dialog, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from "./Loader";
import axiosStuff from "../services/axiosStuff";

const short = require('short-uuid');

const sortOptions = [
    { name: 'Best Rating', to: '/best-rating', current: true },
    { name: 'Most Popular', to: '/popular', current: false },
    { name: 'Newest', to: '/newest', current: false },
    { name: 'Year: New to Old', to: '/year-new-old', current: false },
    { name: 'Year: Old to New', to: '/year-old-new', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

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

    axios.defaults.withCredentials = true // For the sessions the work

    useEffect(() => {
        axiosStuff
            .movieTest().then((response) => {
            console.log('oikee', response)
        })
        axiosStuff
            .test().then((response1) => {
            console.log('testi', response1)
        })
        setTimeout(() => {
            setLoading(false);
        }, 5000)
    }, [])

    // const loadMoreMovies = async () => {
    //     setIsLoading(true);
    //     const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50&page=${currentPage}`, { withCredentials: false }); // 50 movies per page sorted by rating desc
    //     setMovies(movies.concat(response.data.data.movies));
    //     setCurrentPage(currentPage + 1);
    //     setIsLoading(false);
    // };

    const loadMoreMovies = async () => {
        setIsLoading(true);
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50&page=${currentPage}`, { withCredentials: false }); // 50 movies per page sorted by rating desc
        const newMovies = response.data.data.movies.filter(filterMovies);
        setMovies(movies.concat(newMovies));
        setCurrentPage(currentPage + 1);
        setIsLoading(false);
    };

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight && !isLoading && hasMore) {
            loadMoreMovies();
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        setMovies([]);
        setHasMore(true);
				setLoading(false)
    }, [ratingRange]);

    useEffect(() => {
        loadMoreMovies();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleRatingChange = (event, newValue) => {
        setRatingRange(newValue);
    };

    const filterMovies = (movie) => {
        const ratingFilter = movie.rating >= ratingRange[0] && movie.rating <= ratingRange[1];
        const searchFilter = query.trim() === '' || (movie.title.toLowerCase().includes(query.toLowerCase()) || movie.year.toString().includes(query.toLowerCase()) || movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase())) || movie.description_full.toString().includes(query.toLowerCase()));
        return ratingFilter && searchFilter;
    };

    const filteredMovies = movies.filter(filterMovies);

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const handleQueryChange = async (query) => {
        setQuery(query);
        if (query === '') {
            setSearchResults([]);
            setHasMore(true);
            setCurrentPage(1);
            setMovies([]);
            loadMoreMovies();
            return;
        }
        setIsLoading(true);
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?query_term=${query}&limit=50&page=1`, { withCredentials: false });
        setSearchResults(response.data.data.movies);
        setIsLoading(false);
    };

    useEffect(() => {
        if (query === '') {
            setMovies(filteredMovies);
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
                                <div className="mx-auto max-w-7xl pt-16 px-4 sm:px-6 lg:px-8 flex justify-between">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-200">Browse</h1>
                                {/* Sort */}
                                <Menu as="div" className="relative mt-2 inline-block text-left ml-auto">
                                    <div>
                                        <Menu.Button className="group inline-flex justify-center text-lg font-semibold text-gray-200 hover:text-red-600">
                                            Sort
                                            <ChevronDownIcon
                                                className="-mr-1 ml-1 mt-1 h-5 w-5 flex-shrink-0 text-red-500 group-hover:text-red-600"
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
                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="py-1">
                                                {sortOptions.map((option) => (
                                                    <Link
                                                        key={option.name}
                                                        to={option.to}
                                                        className={classNames(
                                                            option.current
                                                                ? 'font-medium text-red-500'
                                                                : 'text-gray-500 hover:text-gray-700',
                                                            'block px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        {option.name}
                                                    </Link>
                                                ))}

                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                                </div>
                            </div>

                            {/* IMDb Score Slider */}
                            <div className="mb-3" style={{ display: "flex", justifyContent: "center" }}>
                                <Box sx={{ width: 350 }}>
                                    <h4 className="text-gray-200 font-semibold">IMDb Rating ( {ratingRange[0]} - {ratingRange[1]} )</h4>
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
                                className="mb-4 mx-auto max-w-lg transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl bg-zinc-800 shadow-2xl transition-all"
                                onChange={(item) => (window.location = item.url)}
                                onSubmit={(event) => event.preventDefault()}
                            >
                                <div className="relative">
                                    <MagnifyingGlassIcon
                                        className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                                        aria-hidden="true"
                                    />
                                    <Combobox.Input
                                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                                        placeholder="Search..."
                                        value={query}
                                        onKeyUp={handleSearchKeyUp}
                                        onChange={(event) => setQuery(event.target.value)}
                                    />
                                </div>
                            </Combobox>

                            {/* Film grid */}
                            <section
                                aria-labelledby="films-heading"
                            >
                                <h2 id="products-heading" className="sr-only">
                                    Films
                                </h2>

                                <InfiniteScroll
                                    dataLength={movies.length} //This is important field to render the next data
                                    next={loadMoreMovies}
                                    hasMore={true}
                                    loader={<h4>Loading...</h4>}
                                    endMessage={
                                        <p style={{ textAlign: 'center' }}>
                                            <b>Yay! You have seen it all</b>
                                        </p>
                                    }
                                >
                                <div className="container grid mobile:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 desktop:grid-cols-5 justify-items-center gap-11 mx-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8">
                                    <style>
                                        {`
                                          justify-items: center;
                                      `}
                                    </style>
                                    {movies.map((movie) => (
                                        <div key={`${short.generate()}`}>
                                            <div className="relative mobile:flex mobile:flex-col mobile:items-center">
                                                <Link className="flex" key={`${movie.id}`} to={`/film/${movie.id}`}>
                                                    <img
                                                        className="rounded"
                                                        src={movie.medium_cover_image}
                                                        alt={movie.title}
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = require('../images/noImage.png');
                                                        }}
                                                    />

                                                <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 bg-gray-900 z-10 flex flex-col justify-center items-center text-center" style={{backgroundColor: 'rgba(26, 32, 44, 0.8)'}}>

                                                    <h4 className="text-lg font-semibold text-red-500 mb-2">{movie.title}</h4>
                                                    <p className="text-sm font-semibold text-gray-200">IMDb Score: {movie.rating} / 10</p>
                                                    <p className="text-sm font-semibold text-gray-200 mb-2">Production Year: {movie.year}</p>
                                                    <p className="hidden text-sm font-semibold text-gray-200">Genres: {movie.genres.map((genre) => (
                                                        <span key={`${short.generate()}`}>{genre} </span>
                                                    ))}</p>
                                                    <p className="hidden text-sm font-semibold text-gray-200">Description: {movie.description_full}</p>


                                                </div>
                                                </Link>
                                                <div className="mt-2 desktop:hidden laptop:hidden mobile:block mobile:mt-4 text-sm font-semibold text-gray-200 text-center">
                                                    <p className="text-sm font-semibold text-red-500">IMDb Score: {movie.rating} / 10</p>
                                                    <p className="text-sm font-semibold text-red-500">Production Year: {movie.year}</p>
                                                </div>
                                            </div>
                                        </div>
                                            ))}
                                    {!hasMore && <p>No more movies to display</p>}
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
