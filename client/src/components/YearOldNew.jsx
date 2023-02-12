import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import axios from 'axios';
import Loader from "./Loader";
import axiosStuff from "../services/axiosStuff";
import searchTorrents from "../services/searchTorrents";

const API_URL = 'https://yts.mx/api/v2/list_movies.json';
const PAGE_SIZE = 50;

const sortOptions = [
    { name: 'Most Popular', to: '/popular', current: true },
    { name: 'Best Rating', to: '/best-rating', current: false },
    { name: 'Newest', to: '/newest', current: false },
    { name: 'Year: New to Old', to: '/year-new-old', current: false },
    { name: 'Year: Old to New', to: '/year-old-new', current: false },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const YearOldNew = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');

    axios.defaults.withCredentials = false // For the sessions the work


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

    const loadMoreMovies = async () => {
        setIsLoading(true);
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=year&order_by=desc&limit=50&page=${currentPage}`); // 50 movies per page sorted by year desc
        setMovies(movies.concat(response.data.data.movies));
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
        loadMoreMovies();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                            <div className="">
                                <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8 flex justify-between">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-200">Browse</h1>
                                    {/*<p className="mt-4 max-w-xl text-sm text-gray-200">*/}
                                    {/*    Our thoughtfully curated collection of films, hand-picked for you.*/}
                                    {/*</p>*/}

                                    {/* Sort */}
                                    <Menu as="div" className="relative mt-3 inline-block text-left ml-auto">
                                        <div>
                                            <Menu.Button className="group inline-flex justify-center text-lg font-semibold text-red-500 hover:text-red-600">
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

                            {/* Film grid */}
                            <section
                                aria-labelledby="films-heading"
                            >
                                <h2 id="products-heading" className="sr-only">
                                    Films
                                </h2>

                                <div className="container grid mobile:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-4 desktop:grid-cols-5 justify-items-center gap-11 mx-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8">
                                    <style>
                                        {`
                                          justify-items: center;
                                      `}
                                    </style>
                                    {movies.map((movie) => (
                                        <div key={`${movie.id}-${movie.key}`}>
                                            <div className="relative mobile:flex mobile:flex-col mobile:items-center">
                                                <Link className="flex" key={`${movie.id}-${movie.key}`} to={`/film/${movie.id}`}>
                                                    <img className="rounded" src={movie.medium_cover_image} alt={movie.title} />

                                                    <div className="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 bg-gray-900 z-10 flex flex-col justify-center items-center text-center" style={{backgroundColor: 'rgba(26, 32, 44, 0.8)'}}>

                                                        <h4 className="text-lg font-semibold text-red-500 mb-2">{movie.title}</h4>
                                                        <p className="text-sm font-semibold text-gray-200">IMDb Score: {movie.rating} / 10</p>
                                                        <p className="text-sm font-semibold text-gray-200 mb-2">Production Year: {movie.year}</p>

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
                            </section>
                        </main>
                    </div>
                </section>
            )}
        </div>
    )
}

export default YearOldNew;
