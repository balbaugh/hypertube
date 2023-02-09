import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from "./Loader";
import axiosStuff from "../services/axiosStuff";
import searchTorrents from "../services/searchTorrents";

const API_URL = 'https://yts.mx/api/v2/list_movies.json';
const PAGE_SIZE = 50;

const List = () => {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [query, setQuery] = useState('');

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
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?limit=50&page=${currentPage}`); // 50 movies per page sorted by most recent
        const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=rating&limit=50&page=${currentPage}`); // 50 movies per page sorted by rating desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=year&limit=50&page=${currentPage}`); // 50 movies per page sorted by year desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=download_count&limit=50&page=${currentPage}`); // 50 movies per page sorted by download count desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=like_count&limit=50&page=${currentPage}`); // 50 movies per page sorted by like count desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=title&limit=50&page=${currentPage}`); // 50 movies per page sorted by title asc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=title&order_by=desc&limit=50&page=${currentPage}`); // 50 movies per page sorted by title desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=year&order_by=desc&limit=50&page=${currentPage}`); // 50 movies per page sorted by year desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=year&order_by=asc&limit=50&page=${currentPage}`); // 50 movies per page sorted by year asc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=download_count&order_by=desc&limit=50&page=${currentPage}`); // 50 movies per page sorted by download count desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=download_count&order_by=asc&limit=50&page=${currentPage}`); // 50 movies per page sorted by download count asc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=like_count&order_by=desc&limit=50&page=${currentPage}`); // 50 movies per page sorted by like count desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=like_count&order_by=asc&limit=50&page=${currentPage}`); // 50 movies per page sorted by like count asc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=rating&order_by=desc&limit=50&page=${currentPage}`); // 50 movies per page sorted by rating desc
        // const response = await axios.get(`https://yts.mx/api/v2/list_movies.json?sort_by=rating&order_by=asc&limit=50&page=${currentPage}`); // 50 movies per page sorted by rating asc
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
        if (windowBottom >= docHeight && !isLoading) {
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
                                <div className="mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-200">Browse Films</h1>
                                    <p className="mt-4 max-w-xl text-sm text-gray-200">
                                        Our thoughtfully curated collection of films, hand-picked for you.
                                    </p>
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
                                        <div >
                                        <Link className="flex" key={movie.id} to={`/film/${movie.id}`}>
                                            <img className="rounded" src={movie.medium_cover_image} alt={movie.title} />
                                        </Link>
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

export default List;
